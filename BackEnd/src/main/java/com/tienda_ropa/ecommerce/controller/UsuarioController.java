package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Usuario;
import com.tienda_ropa.ecommerce.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController extends MasterController<Usuario, Long> {

    private final UsuarioService UsuarioService;

    public UsuarioController(UsuarioService UsuarioService) {
        super(UsuarioService);
        this.UsuarioService = UsuarioService;
    }



}