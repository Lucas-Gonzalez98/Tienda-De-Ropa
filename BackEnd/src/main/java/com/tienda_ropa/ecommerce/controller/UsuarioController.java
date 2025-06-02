package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Usuario;
import com.tienda_ropa.ecommerce.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController extends MasterController<Usuario, Long> {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        super(usuarioService);
        this.usuarioService = usuarioService;
    }

    @GetMapping("/firebase/{firebaseUid}")
    public ResponseEntity<Usuario> getByFirebaseUid(@PathVariable String firebaseUid) {
        return usuarioService.findByFirebaseUid(firebaseUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}