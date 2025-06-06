package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.ImagenProducto;
import com.tienda_ropa.ecommerce.service.ImagenProductoService;
import org.springframework.http.ResponseEntity;
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

    // Agregar imagen base64 a un producto
    @PostMapping("/agregar")
    public ResponseEntity<ImagenProducto> agregarImagen(
            @RequestParam Long idProducto,
            @RequestBody String base64
    ) {
        return ResponseEntity.ok(imagenProductoService.agregarImagen(idProducto, base64));
    }

    // Obtener todas las imágenes de un producto
    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<ImagenProducto>> obtenerPorProducto(@PathVariable Long idProducto) {
        return ResponseEntity.ok(imagenProductoService.obtenerPorProducto(idProducto));
    }


}