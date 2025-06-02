package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Cliente;
import com.tienda_ropa.ecommerce.service.ClienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController extends MasterController<Cliente, Long> {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        super(clienteService);
        this.clienteService = clienteService;
    }



}