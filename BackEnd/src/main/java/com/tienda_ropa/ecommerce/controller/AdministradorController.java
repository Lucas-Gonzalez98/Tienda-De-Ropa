package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Administrador;
import com.tienda_ropa.ecommerce.service.AdministradorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrador")
public class AdministradorController extends MasterController<Administrador, Long> {

    private final AdministradorService administradorService;

    public AdministradorController(AdministradorService administradorService) {
        super(administradorService);
        this.administradorService = administradorService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Administrador> getByUsuarioId(@PathVariable Long usuarioId) {
        return administradorService.findByUsuarioId(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}