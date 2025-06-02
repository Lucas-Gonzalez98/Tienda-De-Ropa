package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.ImagenProducto;
import com.tienda_ropa.ecommerce.service.ImagenProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/magen-producto")
public class ImagenProductoController extends MasterController<ImagenProducto, Long> {

    private final ImagenProductoService imagenProductoService;

    public ImagenProductoController(ImagenProductoService imagenProductoService) {
        super(imagenProductoService);
        this.imagenProductoService = imagenProductoService;
    }



}