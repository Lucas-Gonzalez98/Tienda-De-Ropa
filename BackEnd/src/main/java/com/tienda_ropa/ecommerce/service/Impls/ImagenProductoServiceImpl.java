package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.ImagenProducto;
import com.tienda_ropa.ecommerce.repository.ImagenProductoRepository;
import com.tienda_ropa.ecommerce.service.ImagenProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenProductoServiceImpl extends MasterServiceImpl<ImagenProducto, Long> implements ImagenProductoService {

    @Autowired
    public ImagenProductoServiceImpl(ImagenProductoRepository imagenProductoRepository) {
        super(imagenProductoRepository);
    }

}