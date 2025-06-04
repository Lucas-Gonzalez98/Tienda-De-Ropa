package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Categoria;
import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController extends MasterController<Categoria, Long> {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        super(categoriaService);
        this.categoriaService = categoriaService;
    }
    @GetMapping("/allCategorias")
    public ResponseEntity<List<Categoria>> todasLasCategorias(){
        return ResponseEntity.ok(categoriaService.findAllExcludingFirst());
    }

    @GetMapping("/denominacion/{denominacion}")
    public ResponseEntity<List<Categoria>> getByDenominacion(@PathVariable String denominacion) {
        return ResponseEntity.ok(categoriaService.findByDenominacion(denominacion));
    }
}