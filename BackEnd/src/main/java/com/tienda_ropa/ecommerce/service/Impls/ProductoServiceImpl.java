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


    //Guardar un producto (CREAR)
    @Override
    @Transactional
    public Producto crearProducto(Producto producto, Set<Stock> stock,
                                          Double precioVentaInicial, Double precioCompraInicialOpcional,
                                          List<String> imagenesBase64) {

        // Guardamos el producto
        Producto productoGuardado = productoRepository.save(producto);

        // Asociamos y guardamos el stock
        for (Stock s : stock) {
            s.setProducto(productoGuardado);
        }
        stockRepository.saveAll(stock);

        // Creamos y guardamos las imágenes
        if (imagenesBase64 != null) {
            for (String base64 : imagenesBase64) {
                ImagenProducto imagen = new ImagenProducto();
                imagen.setProducto(productoGuardado);
                imagen.setDenominacion(base64);  // aquí guardas la cadena base64 directamente
                imagenProductoRepository.save(imagen);
            }
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

    //Editar un Producto
    @Override
    @Transactional
    public Producto editarProducto(Long id, Map<String, Object> payload) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Mapear cambios básicos
        Producto modificado = mapper.convertValue(payload.get("producto"), Producto.class);
        existente.setNombre(modificado.getNombre());
        existente.setDescripcion(modificado.getDescripcion());

        // Categorías
        List<Map<String, Object>> categoriasPayload = (List<Map<String, Object>>) payload.get("categorias");
        Set<Categoria> categorias = categoriasPayload.stream()
                .map(cat -> {
                    Categoria categoria = new Categoria();
                    categoria.setId(Long.valueOf(cat.get("id").toString()));
                    return categoria;
                }).collect(Collectors.toSet());
        existente.setCategorias(categorias);

        // Imágenes
        List<Map<String, Object>> imagenesPayload = (List<Map<String, Object>>) payload.get("imagenes");
        Set<ImagenProducto> imagenes = imagenesPayload.stream()
                .map(img -> {
                    ImagenProducto imagen = new ImagenProducto();
                    imagen.setDenominacion(img.get("denominacion").toString());
                    imagen.setProducto(existente);
                    return imagen;
                }).collect(Collectors.toSet());
        existente.getImagenes().clear();
        existente.getImagenes().addAll(imagenes);

        // Precios
        Double nuevoPrecioVenta = Double.valueOf(payload.get("precio").toString());
        Double nuevoPrecioCompra = Double.valueOf(payload.get("precio").toString());

        // Guardar solo si cambia
        boolean cambiarVenta = existente.getId() == null ||
                existente.getId() != null && (!existePrecioVenta(existente, nuevoPrecioVenta));
        boolean cambiarCompra = existente.getId() == null ||
                existente.getId() != null && (!existePrecioCompra(existente, nuevoPrecioCompra));

        if (cambiarVenta) {
            HistoricoPrecioVenta hventa = new HistoricoPrecioVenta();
            hventa.setPrecio(nuevoPrecioVenta);
            hventa.setFecha(LocalDateTime.now());
            hventa.setProducto(existente);
            existente.getDetalles().clear(); // por precaución
        }

        if (cambiarCompra) {
            HistoricoPrecioCompra hcompra = new HistoricoPrecioCompra();
            hcompra.setPrecio(nuevoPrecioCompra);
            hcompra.setFecha(LocalDateTime.now());
            hcompra.setProducto(existente);
        }

        return productoRepository.save(existente);
    }


    private boolean existePrecioVenta(Producto producto, Double precio) {
        return historicoPrecioVentaRepository.existsByProductoIdAndPrecio(producto.getId(), precio);
    }

    private boolean existePrecioCompra(Producto producto, Double precio) {
        return historicoPrecioCompraRepository.existsByProductoIdAndPrecio(producto.getId(), precio);
    }


}