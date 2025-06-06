package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.ImagenProducto;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.repository.ImagenProductoRepository;
import com.tienda_ropa.ecommerce.repository.ProductoRepository;
import com.tienda_ropa.ecommerce.service.ImagenProductoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImagenProductoServiceImpl extends MasterServiceImpl<ImagenProducto, Long> implements ImagenProductoService {

    private final ImagenProductoRepository imagenProductoRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public ImagenProductoServiceImpl(ImagenProductoRepository imagenProductoRepository, ProductoRepository productoRepository) {
        super(imagenProductoRepository);
        this.imagenProductoRepository = imagenProductoRepository;
        this.productoRepository = productoRepository;
    }

    //agregar una imagen en base64 al producto
    @Override
    @Transactional
    public ImagenProducto agregarImagen(Long idProducto, String base64) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        ImagenProducto imagen = new ImagenProducto();
        imagen.setDenominacion(base64);
        imagen.setProducto(producto);
        return imagenProductoRepository.save(imagen);
    }

    //obtener todas las imágenes de un producto
    @Override
    public List<ImagenProducto> obtenerPorProducto(Long idProducto) {
        return imagenProductoRepository.findByProductoId(idProducto);
    }

}