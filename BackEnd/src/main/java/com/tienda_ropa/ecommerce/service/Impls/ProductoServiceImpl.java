package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.repository.*;
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
    private final ImagenProductoRepository imagenProductoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository,
                               StockRepository stockRepository,
                               HistoricoPrecioVentaRepository historicoPrecioVentaRepository,
                               HistoricoPrecioCompraRepository historicoPrecioCompraRepository,
                               ImagenProductoRepository imagenProductoRepository) {
        super(productoRepository);
        this.productoRepository = productoRepository;
        this.stockRepository = stockRepository;
        this.historicoPrecioVentaRepository = historicoPrecioVentaRepository;
        this.historicoPrecioCompraRepository = historicoPrecioCompraRepository;
        this.imagenProductoRepository = imagenProductoRepository;
    }


    //Guardar un producto (CREAR)
    @Override
    @Transactional
    public Producto crearProductoCompleto(Producto producto, Set<Stock> stock,
                                          Double precioVentaInicial, Double precioCompraInicialOpcional,
                                          List<String> imagenesBase64) {

        // Guardamos el producto
        Producto productoGuardado = productoRepository.save(producto);

        // Asociamos y guardamos el stock
        if(stock != null){
            for (Stock s : stock) {
                s.setProducto(productoGuardado);
            }
            stockRepository.saveAll(stock);
        }

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