package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.service.PedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedido")
public class PedidoController extends MasterController<Pedido, Long> {

    private final PedidoService PedidoService;

    public PedidoController(PedidoService PedidoService) {
        super(PedidoService);
        this.PedidoService = PedidoService;
    }



}