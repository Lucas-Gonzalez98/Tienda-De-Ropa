package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.CategoriaProducto;
import com.tienda_ropa.ecommerce.service.CategoriaProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria-producto")
public class CategoriaProductoController extends MasterController<CategoriaProducto, Long> {

    private final CategoriaProductoService CategoriaProductoService;

    public CategoriaProductoController(CategoriaProductoService CategoriaProductoService) {
        super(CategoriaProductoService);
        this.CategoriaProductoService = CategoriaProductoService;
    }



}