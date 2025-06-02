package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Promocion;
import com.tienda_ropa.ecommerce.service.PromocionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocion")
public class PromocionController extends MasterController<Promocion, Long> {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        super(promocionService);
        this.promocionService = promocionService;
    }

    //Ver promociones vigentes
    @GetMapping("/vigentes")
    public ResponseEntity<List<Promocion>> getPromocionesVigentes() {
        return ResponseEntity.ok(promocionService.getPromocionesVigentes());
    }

}