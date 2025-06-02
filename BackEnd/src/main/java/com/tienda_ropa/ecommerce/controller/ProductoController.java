package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/producto")
@CrossOrigin(origins = "*")
public class ProductoController extends MasterController<Producto, Long> {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        super(productoService);
        this.productoService = productoService;
    }



}
