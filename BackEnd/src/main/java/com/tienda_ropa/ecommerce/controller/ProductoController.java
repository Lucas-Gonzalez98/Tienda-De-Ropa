package com.tienda_ropa.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.service.ProductoService;
import org.springframework.asm.TypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/producto")
@CrossOrigin(origins = "*")
public class ProductoController extends MasterController<Producto, Long> {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        super(productoService);
        this.productoService = productoService;
    }


    @PostMapping("/completo")
    public ResponseEntity<Producto> crearProductoCompleto(@RequestBody Map<String, Object> payload) {
        ObjectMapper mapper = new ObjectMapper();

        // Mapear el producto
        Producto producto = mapper.convertValue(payload.get("producto"), Producto.class);

        // Mapear el stock inicial
        List<Stock> stockList = mapper.convertValue(payload.get("stock"), new TypeReference<List<Stock>>() {});
        Set<Stock> stockSet = new HashSet<>(stockList);

        // Mapear los precios
        Double precioVenta = Double.valueOf(payload.get("precioVenta").toString());
        Double precioCompra = null;
        if (payload.get("precioCompra") != null) {
            precioCompra = Double.valueOf(payload.get("precioCompra").toString());
        }

        Producto creado = productoService.crearProductoCompleto(producto, stockSet, precioVenta, precioCompra);
        return ResponseEntity.ok(creado);
    }


}
