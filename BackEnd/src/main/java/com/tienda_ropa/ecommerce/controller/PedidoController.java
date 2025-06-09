package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import com.tienda_ropa.ecommerce.model.enums.Rol;
import com.tienda_ropa.ecommerce.service.PedidoService;
import com.tienda_ropa.ecommerce.service.pdf.PdfGenerator;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedido")
@CrossOrigin(origins = "*")
public class PedidoController extends MasterController<Pedido, Long> {

    private final PedidoService pedidoService;
    private final PdfGenerator pdfGenerator;

    public PedidoController(PedidoService pedidoService, PdfGenerator pdfGenerator) {
        super(pedidoService);
        this.pedidoService = pedidoService;
        this.pdfGenerator = pdfGenerator;
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
    @PutMapping("/{pedidoId}/estado")
    public ResponseEntity<?> cambiarEstadoPedido(
            @PathVariable Long pedidoId,
            @RequestBody Map<String, String> body) {

        try {
            Estado nuevoEstado = Estado.valueOf(body.get("nuevoEstado"));
            Long usuarioId = Long.parseLong(body.get("usuarioId"));
            Rol rol = Rol.valueOf(body.get("rol"));

            pedidoService.cambiarEstadoPedido(pedidoId, nuevoEstado, usuarioId, rol);
            return ResponseEntity.ok("Estado del pedido actualizado correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Enum inválido: " + e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado.");
        }
    }

    @GetMapping("/{id}/factura")
    public ResponseEntity<byte[]> descargarFactura(@PathVariable Long id) {
        Pedido pedido = pedidoService.getById(id); // de tu service
        byte[] pdfBytes = pdfGenerator.generarFacturaPedido(pedido); // Método a implementar en tu servicio pdf
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=factura_pedido_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }


    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarPedido(@PathVariable Long id, @RequestParam Long usuarioId) {
        pedidoService.cambiarEstadoPedido(id, Estado.CANCELADO, usuarioId, Rol.CLIENTE);
        return ResponseEntity.ok().build();
    }

}