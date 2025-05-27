package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Administrador;
import com.tienda_ropa.ecommerce.service.AdministradorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrador")
public class AdministradorController extends MasterController<Administrador, Long> {

    private final AdministradorService AdministradorService;

    public AdministradorController(AdministradorService AdministradorService) {
        super(AdministradorService);
        this.AdministradorService = AdministradorService;
    }



}