package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Domicilio;
import com.tienda_ropa.ecommerce.service.DomicilioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/domicilio")
public class DomicilioController extends MasterController<Domicilio, Long> {

    private final DomicilioService domicilioService;

    public DomicilioController(DomicilioService domicilioService) {
        super(domicilioService);
        this.domicilioService = domicilioService;
    }



}