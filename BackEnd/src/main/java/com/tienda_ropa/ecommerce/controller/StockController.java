package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;
import com.tienda_ropa.ecommerce.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController extends MasterController<Stock, Long> {

    private final StockService stockService;

    public StockController(StockService stockService) {
        super(stockService);
        this.stockService = stockService;
    }

    //filtro por talle y color
    @GetMapping("/filtrar")
    public List<Stock> filtrarPorTalleYColor(@RequestParam Long idTalle, @RequestParam Long idColor) {
        Talle talle = new Talle();
        talle.setId(idTalle);

        Color color = new Color();
        color.setId(idColor);

        return stockService.getDisponiblesPorTalleYColor(talle, color);
    }

    //stock disponible
    @GetMapping("/disponibles")
    public List<Stock> disponibles() {
        return stockService.getDisponibles();
    }

    // cantidad de stock por producto, talle y color)
    @GetMapping("/producto-disponible")
    public ResponseEntity<Integer> obtenerStockDisponible(
            @RequestParam Long productoId,
            @RequestParam Long talleId,
            @RequestParam Long colorId
    ) {
        // Aquí deberías buscar las entidades por ID (suponiendo que tenés sus repositorios)
        Producto producto = new Producto();
        producto.setId(productoId);

        Talle talle = new Talle();
        talle.setId(talleId);

        Color color = new Color();
        color.setId(colorId);

        int cantidadDisponible = stockService.obtenerCantidadStockDisponible(producto, talle, color);

        return ResponseEntity.ok(cantidadDisponible);
    }
    // actualizar la cantidad de stock
    @PutMapping("/actualizar")
    public ResponseEntity<Stock> actualizarCantidad(
            @RequestParam Long idProducto,
            @RequestParam Long idColor,
            @RequestParam Long idTalle,
            @RequestParam Integer cantidad
    ) {
        return ResponseEntity.ok(stockService.actualizarCantidad(idProducto, idColor, idTalle, cantidad));
    }

}