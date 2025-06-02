package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.ImagenPromocion;
import com.tienda_ropa.ecommerce.service.ImagenPromocionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imagen-promocion")
public class ImagenPromocionController extends MasterController<ImagenPromocion, Long> {

    private final ImagenPromocionService imagenPromocionService;

    public ImagenPromocionController(ImagenPromocionService imagenPromocionService) {
        super(imagenPromocionService);
        this.imagenPromocionService = imagenPromocionService;
    }



}