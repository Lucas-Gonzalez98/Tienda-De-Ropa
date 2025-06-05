package com.tienda_ropa.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.service.ProductoService;
import com.fasterxml.jackson.core.type.TypeReference;
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


    //SAVE de un producto (abajo estaria un ejemplo del JSON)
    @PostMapping("/crear-producto")
    public ResponseEntity<Producto> crearProducto(@RequestBody Map<String, Object> payload) {
        ObjectMapper mapper = new ObjectMapper();

        // Mapear el producto
        Producto producto = mapper.convertValue(payload.get("producto"), Producto.class);

        // Mapear el stock
        List<Stock> stockList = mapper.convertValue(payload.get("stock"), new TypeReference<List<Stock>>() {});
        Set<Stock> stockSet = new HashSet<>(stockList);

        // Mapear los precios
        Double precioVenta = Double.valueOf(payload.get("precioVenta").toString());
        Double precioCompra = null;
        if (payload.get("precioCompra") != null) {
            precioCompra = Double.valueOf(payload.get("precioCompra").toString());
        }

        // Mapear las imágenes en base64
        List<String> imagenesBase64 = mapper.convertValue(payload.get("imagenes"), new TypeReference<List<String>>() {});

        Producto creado = productoService.crearProducto(producto, stockSet, precioVenta, precioCompra, imagenesBase64);
        return ResponseEntity.ok(creado);
    }
    /*
     {
      "producto": {
        "nombre": "Remera básica",
        "descripcion": "Algodón 100%",
        "categorias": [{ "id": 1 }, { "id": 2 }]
      },
      "stock": [
        { "color": { "id": 1 }, "talle": { "id": 2 }, "cantidad": 50 },
        { "color": { "id": 2 }, "talle": { "id": 2 }, "cantidad": 20 }
      ],
      "precioVenta": 2999.99,
      "precioCompra": 1500.00,
      "imagenes": [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      ]
    }
     */


    @PutMapping("/{id}")
    public ResponseEntity<Producto> editarProductoCompleto(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(productoService.editarProducto(id, payload));
    }

}
