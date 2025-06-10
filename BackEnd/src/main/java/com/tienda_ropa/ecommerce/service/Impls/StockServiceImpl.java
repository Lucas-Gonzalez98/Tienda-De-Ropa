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

    // Métodos existentes (mantener sin cambios)
    @Override
    public List<Stock> getDisponiblesPorTalleYColor(Talle talle, Color color) {
        return stockRepository.findByTalleAndColorAndCantidadGreaterThan(talle, color, 0);
    }

    @Override
    public List<Stock> getDisponibles() {
        return stockRepository.findByCantidadGreaterThan(0);
    }

    @Override
    public int obtenerCantidadStockDisponible(Producto producto, Talle talle, Color color) {
        return stockRepository.obtenerCantidadStockDisponible(producto, talle, color);
    }

    @Override
    public List<Stock> getByProducto(Long productoId) {
        return stockRepository.findByProductoId(productoId);
    }

    @Override
    public Optional<Stock> getStock(Long idProducto, Long idColor, Long idTalle) {
        return stockRepository.findStockDisponible(idProducto, idColor, idTalle);
    }

    // 🟢 CREAR STOCK - Crear nuevo registro de stock
    @Override
    @Transactional
    public Stock crearStock(Long idProducto, Long idColor, Long idTalle, Integer cantidad,
                            Double precioCompra) {

        // Verificar que no existe stock para esta combinación
        Optional<Stock> stockExistente = stockRepository.findStockDisponible(idProducto, idColor, idTalle);
        if (stockExistente.isPresent()) {
            throw new RuntimeException("Ya existe un stock para esa combinación de producto, color y talle.");
        }

        // Validaciones
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        if (precioCompra <= 0) {
            throw new IllegalArgumentException("El precio de compra debe ser mayor a 0");
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

        // SIEMPRE crear históricos al crear nuevo stock
        crearHistoricoPrecioCompra(producto, precioCompra);
        crearHistoricoPrecioVenta(producto, precioCompra);

        return stockGuardado;
    }

    // 🔘 AGREGAR STOCK - Solo agregar cantidad a stock existente
    @Override
    @Transactional
    public Stock agregarStock(Long idProducto, Long idColor, Long idTalle, Integer cantidadAdicional,
                              Double precioCompra) {

        // Buscar stock existente
        Stock stock = stockRepository.findStockDisponible(idProducto, idColor, idTalle)
                .orElseThrow(() -> new EntityNotFoundException("Stock no encontrado. Use 'Crear Stock' para crear uno nuevo."));

        // Validaciones
        if (cantidadAdicional <= 0) {
            throw new IllegalArgumentException("La cantidad adicional debe ser mayor a 0");
        }
        if (precioCompra <= 0) {
            throw new IllegalArgumentException("El precio de compra debe ser mayor a 0");
        }

        // Actualizar cantidad
        stock.setCantidad(stock.getCantidad() + cantidadAdicional);

        // Solo crear históricos si los precios son diferentes
        if (esPrecioCompraDiferente(idProducto, precioCompra)) {
            crearHistoricoPrecioCompra(stock.getProducto(), precioCompra);
            crearHistoricoPrecioVenta(stock.getProducto(), precioCompra);
        }

        return stockRepository.save(stock);
    }

    // 🟡 ACTUALIZAR STOCK - Modificar stock existente
    @Override
    @Transactional
    public Stock actualizarStock(Long stockId, Long idProducto, Long idColor, Long idTalle,
                                 Integer nuevaCantidad, Double precioCompra) {

        // Buscar stock por ID
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new EntityNotFoundException("Stock no encontrado"));

        // Validaciones
        if (nuevaCantidad < 0) {
            throw new IllegalArgumentException("La cantidad no puede ser negativa");
        }
        if (precioCompra <= 0) {
            throw new IllegalArgumentException("El precio de compra debe ser mayor a 0");
        }
        // Obtener entidades (pueden haber cambiado)
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        Color color = colorRepository.findById(idColor)
                .orElseThrow(() -> new EntityNotFoundException("Color no encontrado"));
        Talle talle = talleRepository.findById(idTalle)
                .orElseThrow(() -> new EntityNotFoundException("Talle no encontrado"));

        // Verificar que no existe otro stock con la nueva combinación (si cambió)
        if (!stock.getProducto().getId().equals(idProducto) ||
                !stock.getColor().getId().equals(idColor) ||
                !stock.getTalle().getId().equals(idTalle)) {

            Optional<Stock> stockExistente = stockRepository.findStockDisponible(idProducto, idColor, idTalle);
            if (stockExistente.isPresent() && !stockExistente.get().getId().equals(stockId)) {
                throw new RuntimeException("Ya existe un stock para esa combinación de producto, color y talle.");
            }
        }

        // Actualizar datos del stock
        stock.setProducto(producto);
        stock.setColor(color);
        stock.setTalle(talle);
        stock.setCantidad(nuevaCantidad);

        // Solo crear históricos si los precios son diferentes
        if (esPrecioCompraDiferente(idProducto, precioCompra)) {
            crearHistoricoPrecioCompra(producto, precioCompra);
            crearHistoricoPrecioVenta(producto, precioCompra);
        }

        return stockRepository.save(stock);
    }

    // Métodos auxiliares para validar precios
    @Override
    public boolean esPrecioCompraDiferente(Long productoId, Double nuevoPrecio) {
        Double ultimoPrecio = obtenerUltimoPrecioCompra(productoId);
        return ultimoPrecio == null || !ultimoPrecio.equals(nuevoPrecio);
    }

    @Override
    public boolean esPrecioVentaDiferente(Long productoId, Double nuevoPrecio) {
        Double ultimoPrecio = obtenerUltimoPrecioVenta(productoId);
        return ultimoPrecio == null || !ultimoPrecio.equals(nuevoPrecio);
    }

    @Override
    public Double obtenerUltimoPrecioCompra(Long productoId) {
        return historicoPrecioCompraRepository.findTopByProductoIdOrderByFechaDesc(productoId)
                .map(HistoricoPrecioCompra::getPrecio)
                .orElse(null);
    }

    @Override
    public Double obtenerUltimoPrecioVenta(Long productoId) {
        return historicoPrecioVentaRepository.findTopByProductoIdOrderByFechaDesc(productoId)
                .map(HistoricoPrecioVenta::getPrecio)
                .orElse(null);
    }

    // Métodos privados para crear históricos
    private void crearHistoricoPrecioCompra(Producto producto, Double precio) {
        HistoricoPrecioCompra historico = new HistoricoPrecioCompra();
        historico.setProducto(producto);
        historico.setFecha(LocalDateTime.now());
        historico.setPrecio(precio);
        historicoPrecioCompraRepository.save(historico);
    }

    private void crearHistoricoPrecioVenta(Producto producto, Double precio) {
        HistoricoPrecioVenta historico = new HistoricoPrecioVenta();
        historico.setProducto(producto);
        historico.setFecha(LocalDateTime.now());
        historico.setPrecio(precio * 1.5);
        historicoPrecioVentaRepository.save(historico);
    }
}