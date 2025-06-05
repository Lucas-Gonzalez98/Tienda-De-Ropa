package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.PromocionDetalle;
import com.tienda_ropa.ecommerce.service.PromocionDetalleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocion-detalle")
public class PromocionDetalleController extends MasterController<PromocionDetalle, Long> {

    private final PromocionDetalleService promocionDetalleService;

    public PromocionDetalleController(PromocionDetalleService promocionDetalleService) {
        super(promocionDetalleService);
        this.promocionDetalleService = promocionDetalleService;
    }


    // Asociar productos individuales a una promoción
    @PostMapping("/asociar-productos")
    public ResponseEntity<Void> asociarProductos(@RequestParam Long idPromocion, @RequestBody Long[] idsProducto) {
        promocionDetalleService.asociarProductosAPromocion(idPromocion, idsProducto);
        return ResponseEntity.ok().build();
    }

    // Asociar productos por categoría
    @PostMapping("/asociar-categoria")
    public ResponseEntity<Void> asociarPorCategoria(@RequestParam Long idPromocion, @RequestParam Long idCategoria) {
        promocionDetalleService.asociarProductosDeCategoria(idPromocion, idCategoria);
        return ResponseEntity.ok().build();
    }

    // Quitar un producto de una promoción
    @DeleteMapping("/quitar/{id}")
    public ResponseEntity<Void> quitarProducto(@PathVariable Long id) {
        promocionDetalleService.quitarProductoDePromocion(id);
        return ResponseEntity.noContent().build();
    }


}