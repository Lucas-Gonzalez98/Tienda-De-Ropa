package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.repository.*;
import com.tienda_ropa.ecommerce.service.StockService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class StockServiceImpl extends MasterServiceImpl<Stock, Long> implements StockService {

    private final StockRepository stockRepository;
    private final ColorRepository colorRepository;
    private final TalleRepository talleRepository;
    private final ProductoRepository productoRepository;
    private final HistoricoPrecioCompraRepository historicoPrecioCompraRepository;

    @Autowired
    public StockServiceImpl(StockRepository stockRepository, ColorRepository colorRepository, TalleRepository talleRepository,
                            HistoricoPrecioCompraRepository historicoPrecioCompraRepository, ProductoRepository productoRepository) {
        super(stockRepository);
        this.stockRepository = stockRepository;
        this.colorRepository = colorRepository;
        this.talleRepository = talleRepository;
        this.productoRepository = productoRepository;
        this.historicoPrecioCompraRepository = historicoPrecioCompraRepository;
    }

    //filtrar stock por talle, color y disponibilidad
    @Override
    public List<Stock> getDisponiblesPorTalleYColor(Talle talle, Color color) {

        return stockRepository.findByTalleAndColorAndCantidadGreaterThan(talle, color, 0);
    }
    //obtener todos los el stock con cantidad > 0
    @Override
    public List<Stock> getDisponibles() {
        return stockRepository.findByCantidadGreaterThan(0);
    }
    // cantidad de stock por producto, talle y color)
    @Override
    public int obtenerCantidadStockDisponible(Producto producto, Talle talle, Color color) {
        return stockRepository.obtenerCantidadStockDisponible(producto, talle, color);
    }

    // Crear stock con combinacion e Historico Compra
    @Override
    @Transactional
    public Stock crearStock(Long idProducto, Long idColor, Long idTalle, Integer cantidad, Double precio) {
        // Verificamos si ya existe el stock
        Optional<Stock> stockExistente = stockRepository.findStockDisponible(idProducto, idColor, idTalle);
        if (stockExistente.isPresent()) {
            throw new RuntimeException("Ya existe un stock para esa combinación de producto, color y talle.");
        }

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        Color color = colorRepository.findById(idColor)
                .orElseThrow(() -> new EntityNotFoundException("Color no encontrado"));
        Talle talle = talleRepository.findById(idTalle)
                .orElseThrow(() -> new EntityNotFoundException("Talle no encontrado"));

        Stock nuevoStock = new Stock();
        nuevoStock.setProducto(producto);
        nuevoStock.setColor(color);
        nuevoStock.setTalle(talle);
        nuevoStock.setCantidad(cantidad);

        // Guardamos el stock
        stockRepository.save(nuevoStock);

        // Guardamos el histórico de precio de compra
        HistoricoPrecioCompra historico = new HistoricoPrecioCompra();
        historico.setProducto(producto);
        historico.setFecha(LocalDateTime.now());
        historico.setPrecio(precio);
        historicoPrecioCompraRepository.save(historico);

        return nuevoStock;
    }

    // Actualizar Stock + Historico Compra
    @Override
    @Transactional
    public Stock actualizarStock(Long idProducto, Long idColor, Long idTalle, Integer cantidadAdicional, Double nuevoPrecioCompra) {
        Stock stock = stockRepository.findStockDisponible(idProducto, idColor, idTalle)
                .orElseThrow(() -> new EntityNotFoundException("Stock no encontrado para la combinación"));

        stock.setCantidad(stock.getCantidad() + cantidadAdicional);

        // Verificamos si el nuevo precio ya existe como el último
        Optional<HistoricoPrecioCompra> ultimoPrecioOptional =
                historicoPrecioCompraRepository.findTopByProductoIdOrderByFechaDesc(idProducto);

        boolean crearNuevoHistorico = true;
        if (ultimoPrecioOptional.isPresent()) {
            Double ultimoPrecio = ultimoPrecioOptional.get().getPrecio();
            if (Objects.equals(ultimoPrecio, nuevoPrecioCompra)) {
                crearNuevoHistorico = false;
            }
        }

        if (crearNuevoHistorico) {
            HistoricoPrecioCompra nuevoHistorico = new HistoricoPrecioCompra();
            nuevoHistorico.setProducto(stock.getProducto());
            nuevoHistorico.setFecha(LocalDateTime.now());
            nuevoHistorico.setPrecio(nuevoPrecioCompra);
            historicoPrecioCompraRepository.save(nuevoHistorico);
        }

        return stockRepository.save(stock);
    }


}