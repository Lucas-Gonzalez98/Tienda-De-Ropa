package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Provincia;
import com.tienda_ropa.ecommerce.service.ProvinciaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provincia")
public class ProvinciaController extends MasterController<Provincia, Long> {

    private final ProvinciaService provinciaService;

    public ProvinciaController(ProvinciaService provinciaService) {
        super(provinciaService);
        this.provinciaService = provinciaService;
    }



}