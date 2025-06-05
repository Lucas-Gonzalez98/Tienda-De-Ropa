package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedido")
@CrossOrigin(origins = "*")
public class PedidoController extends MasterController<Pedido, Long> {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        super(pedidoService);
        this.pedidoService = pedidoService;
    }

    //permitir que un cliente consulte su historial de pedidos
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Pedido>> getPedidosByCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(pedidoService.getByClienteId(clienteId));
    }

    //Realizar un pedido.
    @PostMapping("/realizar/{clienteId}/{domicilioId}")
    public ResponseEntity<Pedido> realizarPedido(
            @RequestBody Pedido pedido,
            @PathVariable Long clienteId,
            @PathVariable Long domicilioId
    ) {
        Pedido nuevo = pedidoService.realizarPedido(pedido, clienteId, domicilioId);
        return ResponseEntity.ok(nuevo);
    }
}