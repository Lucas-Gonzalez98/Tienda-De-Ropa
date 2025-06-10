package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;
import com.tienda_ropa.ecommerce.service.StockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController extends MasterController<Stock, Long> {

    private final StockService stockService;

    public StockController(StockService stockService) {
        super(stockService);
        this.stockService = stockService;
    }

    // Endpoints existentes (mantener)
    @GetMapping("/filtrar")
    public List<Stock> filtrarPorTalleYColor(@RequestParam Long idTalle, @RequestParam Long idColor) {
        Talle talle = new Talle();
        talle.setId(idTalle);

        Color color = new Color();
        color.setId(idColor);

        return stockService.getDisponiblesPorTalleYColor(talle, color);
    }

    @GetMapping("/disponibles")
    public List<Stock> disponibles() {
        return stockService.getDisponibles();
    }

    @GetMapping("/producto-disponible")
    public ResponseEntity<Integer> obtenerStockDisponible(
            @RequestParam Long productoId,
            @RequestParam Long talleId,
            @RequestParam Long colorId
    ) {
        Producto producto = new Producto();
        producto.setId(productoId);

        Talle talle = new Talle();
        talle.setId(talleId);

        Color color = new Color();
        color.setId(colorId);

        int cantidadDisponible = stockService.obtenerCantidadStockDisponible(producto, talle, color);
        return ResponseEntity.ok(cantidadDisponible);
    }

    @GetMapping("/producto/{id}")
    public ResponseEntity<List<Stock>> getByProducto(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getByProducto(id));
    }

    @GetMapping("/buscar/stock")
    public ResponseEntity<Optional<Stock>> buscarStock(@RequestParam Long idProducto, @RequestParam Long idTalle, @RequestParam Long idColor) {
        return ResponseEntity.ok(stockService.getStock(idProducto, idColor, idTalle));
    }

    // 🟢 CREAR STOCK - Nuevo endpoint mejorado
    @PostMapping("/crear")
    public ResponseEntity<?> crearStock(
            @RequestParam Long idProducto,
            @RequestParam Long idColor,
            @RequestParam Long idTalle,
            @RequestParam Integer cantidad,
            @RequestParam Double precioCompra) {

        try {
            Stock nuevoStock = stockService.crearStock(idProducto, idColor, idTalle, cantidad, precioCompra);
            return ResponseEntity.ok(nuevoStock);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    // 🔘 AGREGAR STOCK - Nuevo endpoint
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarStock(
            @RequestParam Long idProducto,
            @RequestParam Long idColor,
            @RequestParam Long idTalle,
            @RequestParam Integer cantidadAdicional,
            @RequestParam Double precioCompra) {

        try {
            Stock stockActualizado = stockService.agregarStock(idProducto, idColor, idTalle, cantidadAdicional, precioCompra);
            return ResponseEntity.ok(stockActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    // 🟡 ACTUALIZAR STOCK - Endpoint mejorado
    @PutMapping("/actualizar/{stockId}")
    public ResponseEntity<?> actualizarStock(
            @PathVariable Long stockId,
            @RequestParam Long idProducto,
            @RequestParam Long idColor,
            @RequestParam Long idTalle,
            @RequestParam Integer nuevaCantidad,
            @RequestParam Double precioCompra) {

        try {
            Stock stockActualizado = stockService.actualizarStock(stockId, idProducto, idColor, idTalle, nuevaCantidad, precioCompra);
            return ResponseEntity.ok(stockActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    // Endpoints auxiliares para obtener precios
    @GetMapping("/precio-compra/{productoId}")
    public ResponseEntity<Double> obtenerUltimoPrecioCompra(@PathVariable Long productoId) {
        Double precio = stockService.obtenerUltimoPrecioCompra(productoId);
        return ResponseEntity.ok(precio);
    }

    @GetMapping("/precio-venta/{productoId}")
    public ResponseEntity<Double> obtenerUltimoPrecioVenta(@PathVariable Long productoId) {
        Double precio = stockService.obtenerUltimoPrecioVenta(productoId);
        return ResponseEntity.ok(precio);
    }
}