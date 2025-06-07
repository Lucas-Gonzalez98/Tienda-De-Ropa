package com.tienda_ropa.ecommerce.service.Impls;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.repository.*;
import com.tienda_ropa.ecommerce.service.ProductoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl extends MasterServiceImpl<Producto, Long> implements ProductoService {

    private final ProductoRepository productoRepository;
    private final StockRepository stockRepository;
    private final HistoricoPrecioVentaRepository historicoPrecioVentaRepository;
    private final HistoricoPrecioCompraRepository historicoPrecioCompraRepository;
    private final ImagenProductoRepository imagenProductoRepository;

    private final ObjectMapper mapper;

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
        this.mapper = new ObjectMapper();
    }




    //Editar un Producto
    @Override
    @Transactional
    public Producto editarProducto(Long id, Producto modificado) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Cambios básicos
        existente.setNombre(modificado.getNombre());
        existente.setDescripcion(modificado.getDescripcion());

        // Categorías
        if (modificado.getCategorias() != null) {
            Set<Categoria> categorias = modificado.getCategorias().stream()
                    .map(cat -> {
                        Categoria c = new Categoria();
                        c.setId(cat.getId());
                        return c;
                    }).collect(Collectors.toSet());
            existente.setCategorias(categorias);
        }

        // Imágenes
        if (modificado.getImagenes() != null) {
            Set<ImagenProducto> imagenes = modificado.getImagenes().stream()
                    .map(img -> {
                        ImagenProducto imagen = new ImagenProducto();
                        imagen.setDenominacion(img.getDenominacion());
                        imagen.setProducto(existente);
                        return imagen;
                    }).collect(Collectors.toSet());

            existente.getImagenes().clear();
            existente.getImagenes().addAll(imagenes);
        }

        // Precio de venta (si cambió)
        Optional<Double> nuevoPrecioOpt = modificado.getHistoricoPreciosVenta()
                .stream().map(HistoricoPrecioVenta::getPrecio).findFirst();

        if (nuevoPrecioOpt.isPresent()) {
            Double nuevoPrecio = nuevoPrecioOpt.get();
            Optional<HistoricoPrecioVenta> ultimoPrecioOpt = existente.getHistoricoPreciosVenta()
                    .stream().max(Comparator.comparing(HistoricoPrecioVenta::getFecha));

            if (ultimoPrecioOpt.isEmpty() || !ultimoPrecioOpt.get().getPrecio().equals(nuevoPrecio)) {
                HistoricoPrecioVenta nuevoHist = new HistoricoPrecioVenta();
                nuevoHist.setFecha(LocalDateTime.now());
                nuevoHist.setPrecio(nuevoPrecio);
                nuevoHist.setProducto(existente);
                existente.getHistoricoPreciosVenta().add(nuevoHist);
            }
        }
        return productoRepository.save(existente);
    }


    /*
    //Guardar un producto (CREAR)
    @Override
    @Transactional
    public Producto crearProducto(Producto producto, Set<Stock> stock,
                                  Double precioVentaInicial, Double precioCompraInicialOpcional,
                                  List<String> imagenesBase64) {

        // Guardamos el producto
        Producto productoGuardado = productoRepository.save(producto);

        // Asociamos y guardamos el stock
        if (stock != null) {
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

        return productoGuardado;
    }

     */
}