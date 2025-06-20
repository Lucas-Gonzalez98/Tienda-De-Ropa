package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Telefono;
import com.tienda_ropa.ecommerce.service.TelefonoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telefono")
public class TelefonoController extends MasterController<Telefono, Long> {

    private final TelefonoService telefonoService;

    public TelefonoController(TelefonoService telefonoService) {
        super(telefonoService);
        this.telefonoService = telefonoService;
    }



}