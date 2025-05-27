package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Localidad;
import com.tienda_ropa.ecommerce.service.LocalidadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/localidad")
public class LocalidadController extends MasterController<Localidad, Long> {

    private final LocalidadService LocalidadService;

    public LocalidadController(LocalidadService LocalidadService) {
        super(LocalidadService);
        this.LocalidadService = LocalidadService;
    }



}