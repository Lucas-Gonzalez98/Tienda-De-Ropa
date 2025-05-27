package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Promocion;
import com.tienda_ropa.ecommerce.service.PromocionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocion")
public class PromocionController extends MasterController<Promocion, Long> {

    private final PromocionService PromocionService;

    public PromocionController(PromocionService PromocionService) {
        super(PromocionService);
        this.PromocionService = PromocionService;
    }



}