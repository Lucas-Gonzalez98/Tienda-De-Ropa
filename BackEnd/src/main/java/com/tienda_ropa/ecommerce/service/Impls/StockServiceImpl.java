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
    private final HistoricoPrecioVentaRepository historicoPrecioVentaRepository;

    @Autowired
    public StockServiceImpl(StockRepository stockRepository, ColorRepository colorRepository, TalleRepository talleRepository,
                            HistoricoPrecioCompraRepository historicoPrecioCompraRepository, ProductoRepository productoRepository,
                            HistoricoPrecioVentaRepository historicoPrecioVentaRepository) {
        super(stockRepository);
        this.stockRepository = stockRepository;
        this.colorRepository = colorRepository;
        this.talleRepository = talleRepository;
        this.productoRepository = productoRepository;
        this.historicoPrecioCompraRepository = historicoPrecioCompraRepository;
        this.historicoPrecioVentaRepository = historicoPrecioVentaRepository;
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
    public Stock crearStock(Long idProducto, Long idColor, Long idTalle, Integer cantidad, Double precioCompra) {
        // Verificar stock existente
        Optional<Stock> stockExistente = stockRepository.findStockDisponible(idProducto, idColor, idTalle);
        if (stockExistente.isPresent()) {
            throw new RuntimeException("Ya existe un stock para esa combinación de producto, color y talle.");
        }

        // Obtener entidades
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        Color color = colorRepository.findById(idColor)
                .orElseThrow(() -> new EntityNotFoundException("Color no encontrado"));
        Talle talle = talleRepository.findById(idTalle)
                .orElseThrow(() -> new EntityNotFoundException("Talle no encontrado"));

        // Crear nuevo stock
        Stock nuevoStock = new Stock();
        nuevoStock.setProducto(producto);
        nuevoStock.setColor(color);
        nuevoStock.setTalle(talle);
        nuevoStock.setCantidad(cantidad);
        Stock stockGuardado = stockRepository.save(nuevoStock);

        // Registrar histórico de precio de compra
        HistoricoPrecioCompra historicoPrecioCompra = new HistoricoPrecioCompra();
        historicoPrecioCompra.setProducto(producto);
        historicoPrecioCompra.setFecha(LocalDateTime.now());
        historicoPrecioCompra.setPrecio(precioCompra);
        historicoPrecioCompraRepository.save(historicoPrecioCompra);

        // Calcular y registrar histórico de precio de venta (50% más)
        Double precioVenta = precioCompra * 1.5;
        HistoricoPrecioVenta historicoPrecioVenta = new HistoricoPrecioVenta();
        historicoPrecioVenta.setProducto(producto);
        historicoPrecioVenta.setFecha(LocalDateTime.now());
        historicoPrecioVenta.setPrecio(precioVenta);
        historicoPrecioVentaRepository.save(historicoPrecioVenta);

        return stockGuardado;
    }


    // Actualizar Stock
    @Override
    @Transactional
    public Stock actualizarStock(Long idProducto, Long idColor, Long idTalle,
                                 Integer cantidadAdicional, Double nuevoPrecioCompra) {
        Stock stock = stockRepository.findStockDisponible(idProducto, idColor, idTalle)
                .orElseThrow(() -> new EntityNotFoundException("Stock no encontrado"));

        // Actualizar cantidad
        stock.setCantidad(stock.getCantidad() + cantidadAdicional);

        // Registrar nuevo precio de compra
        HistoricoPrecioCompra historicoPrecioCompra = new HistoricoPrecioCompra();
        historicoPrecioCompra.setProducto(stock.getProducto());
        historicoPrecioCompra.setFecha(LocalDateTime.now());
        historicoPrecioCompra.setPrecio(nuevoPrecioCompra);
        historicoPrecioCompraRepository.save(historicoPrecioCompra);

        // Calcular y registrar nuevo precio de venta
        Double precioVenta = nuevoPrecioCompra * 1.5;
        HistoricoPrecioVenta historicoPrecioVenta = new HistoricoPrecioVenta();
        historicoPrecioVenta.setProducto(stock.getProducto());
        historicoPrecioVenta.setFecha(LocalDateTime.now());
        historicoPrecioVenta.setPrecio(precioVenta);
        historicoPrecioVentaRepository.save(historicoPrecioVenta);

        return stockRepository.save(stock);
    }



}