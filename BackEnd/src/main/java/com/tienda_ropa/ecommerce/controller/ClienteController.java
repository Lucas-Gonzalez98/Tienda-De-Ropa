package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Cliente;
import com.tienda_ropa.ecommerce.service.ClienteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController extends MasterController<Cliente, Long> {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        super(clienteService);
        this.clienteService = clienteService;
    }

    @PostMapping
    @Override
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente) {
        try {
            Cliente clienteGuardado = clienteService.saveWithRelatedEntities(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteGuardado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Cliente> getByUsuarioId(@PathVariable Long usuarioId) {
        return clienteService.findByUsuarioId(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}