package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.repository.HistoricoPrecioCompraRepository;
import com.tienda_ropa.ecommerce.repository.HistoricoPrecioVentaRepository;
import com.tienda_ropa.ecommerce.repository.ProductoRepository;
import com.tienda_ropa.ecommerce.repository.StockRepository;
import com.tienda_ropa.ecommerce.service.ProductoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductoServiceImpl extends MasterServiceImpl<Producto, Long> implements ProductoService {

    private final ProductoRepository productoRepository;
    private final StockRepository stockRepository;
    private final HistoricoPrecioVentaRepository historicoPrecioVentaRepository;
    private final HistoricoPrecioCompraRepository historicoPrecioCompraRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository,
                               StockRepository stockRepository,
                               HistoricoPrecioVentaRepository historicoPrecioVentaRepository,
                               HistoricoPrecioCompraRepository historicoPrecioCompraRepository) {
        super(productoRepository);
        this.productoRepository = productoRepository;
        this.stockRepository = stockRepository;
        this.historicoPrecioVentaRepository = historicoPrecioVentaRepository;
        this.historicoPrecioCompraRepository = historicoPrecioCompraRepository;
    }

    @Override
    @Transactional
    public Producto crearProductoCompleto(Producto producto, Set<Stock> stock,
                                          Double precioVentaInicial, Double precioCompraInicialOpcional) {

        // Guardamos el producto
        Producto productoGuardado = productoRepository.save(producto);

        // Asociamos y guardamos el stock
        for (Stock s : stock) {
            s.setProducto(productoGuardado);
        }
        stockRepository.saveAll(stock);

        // Creamos precio de venta inicial
        HistoricoPrecioVenta precioVenta = new HistoricoPrecioVenta();
        precioVenta.setProducto(productoGuardado);
        precioVenta.setPrecio(precioVentaInicial);
        precioVenta.setFecha(LocalDateTime.now());
        historicoPrecioVentaRepository.save(precioVenta);

        // Si hay precio de compra, lo registramos también
        if (precioCompraInicialOpcional != null) {
            HistoricoPrecioCompra precioCompra = new HistoricoPrecioCompra();
            precioCompra.setProducto(productoGuardado);
            precioCompra.setPrecio(precioCompraInicialOpcional);
            precioCompra.setFecha(LocalDateTime.now());
            historicoPrecioCompraRepository.save(precioCompra);
        }

        return productoGuardado;
    }

}