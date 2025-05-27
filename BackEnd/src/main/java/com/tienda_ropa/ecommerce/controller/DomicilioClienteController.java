package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.DomicilioCliente;
import com.tienda_ropa.ecommerce.service.DomicilioClienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domicilio-cliente")
public class DomicilioClienteController extends MasterController<DomicilioCliente, Long> {

    private final DomicilioClienteService DomicilioClienteService;

    public DomicilioClienteController(DomicilioClienteService DomicilioClienteService) {
        super(DomicilioClienteService);
        this.DomicilioClienteService = DomicilioClienteService;
    }



}