package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Cliente;
import com.tienda_ropa.ecommerce.model.Domicilio;
import com.tienda_ropa.ecommerce.service.ClienteService;
import com.tienda_ropa.ecommerce.service.DomicilioService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/cliente")
@CrossOrigin(origins = "*")
public class ClienteController extends MasterController<Cliente, Long> {

    private final ClienteService clienteService;
    private final DomicilioService domicilioService;

    public ClienteController(ClienteService clienteService, DomicilioService domicilioService) {
        super(clienteService);
        this.clienteService = clienteService;
        this.domicilioService = domicilioService;
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

    @PostMapping("/{clienteId}/domicilios")
    public ResponseEntity<Domicilio> agregarDomicilioACliente(
            @PathVariable Long clienteId,
            @RequestBody Domicilio domicilioRequest) {
        try {
            Domicilio guardado = clienteService.agregarDomicilio(clienteId, domicilioRequest);
            return ResponseEntity.ok(guardado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{clienteId}/domicilios/{domicilioId}")
    public ResponseEntity<?> desasociarDomicilio(
            @PathVariable Long clienteId,
            @PathVariable Long domicilioId) {
        Cliente cliente = clienteService.getById(clienteId);
        Domicilio domicilio = domicilioService.getById(domicilioId);

        cliente.getDomicilios().remove(domicilio);
        clienteService.save(cliente);

        return ResponseEntity.noContent().build();
    }



}