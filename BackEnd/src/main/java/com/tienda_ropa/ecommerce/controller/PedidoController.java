package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import com.tienda_ropa.ecommerce.model.enums.Rol;
import com.tienda_ropa.ecommerce.service.PedidoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    // Endpoint con filtros de búsqueda para ver pedidos realizados
    @GetMapping("/filtro")
    public ResponseEntity<List<Pedido>> getPedidosFiltrados(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta
    ) {
        return ResponseEntity.ok(pedidoService.getByFiltros(clienteId, estado, fechaDesde, fechaHasta));
    }

    // Endpoint para cambiar el estado de un pedido
    @PutMapping("/{id}/cambiar-estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable Long id,
            @RequestParam Estado nuevoEstado,
            @RequestParam Long usuarioId,
            @RequestParam Rol rol
    ) {
        pedidoService.cambiarEstadoPedido(id, nuevoEstado, usuarioId, rol);
        return ResponseEntity.ok().build();
    }
}