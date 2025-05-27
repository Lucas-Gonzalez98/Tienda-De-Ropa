package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Categoria;
import com.tienda_ropa.ecommerce.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController extends MasterController<Categoria, Long> {

    private final CategoriaService CategoriaService;

    public CategoriaController(CategoriaService CategoriaService) {
        super(CategoriaService);
        this.CategoriaService = CategoriaService;
    }



}