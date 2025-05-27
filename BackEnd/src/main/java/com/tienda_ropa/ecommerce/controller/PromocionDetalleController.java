package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.PromocionDetalle;
import com.tienda_ropa.ecommerce.service.PromocionDetalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocion-detalle")
public class PromocionDetalleController extends MasterController<PromocionDetalle, Long> {

    private final PromocionDetalleService PromocionDetalleService;

    public PromocionDetalleController(PromocionDetalleService PromocionDetalleService) {
        super(PromocionDetalleService);
        this.PromocionDetalleService = PromocionDetalleService;
    }



}