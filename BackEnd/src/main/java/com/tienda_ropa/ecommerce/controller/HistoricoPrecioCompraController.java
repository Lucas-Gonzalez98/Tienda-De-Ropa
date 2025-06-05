package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioCompraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico-precio-compra")
public class HistoricoPrecioCompraController extends MasterController<HistoricoPrecioCompra, Long> {

    private final HistoricoPrecioCompraService historicoPrecioCompraService;

    public HistoricoPrecioCompraController(HistoricoPrecioCompraService historicoPrecioCompraService) {
        super(historicoPrecioCompraService);
        this.historicoPrecioCompraService = historicoPrecioCompraService;
    }

    @GetMapping("/ultimo/{productoId}")
    public ResponseEntity<HistoricoPrecioCompra> obtenerUltimoPorProducto(@PathVariable Long productoId) {
        return historicoPrecioCompraService.obtenerUltimoPorProducto(productoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ordenado")
    public ResponseEntity<List<HistoricoPrecioCompra>> listarTodosOrdenadosPorFecha() {
        List<HistoricoPrecioCompra> lista = historicoPrecioCompraService.listarTodosOrdenadosPorFecha();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<HistoricoPrecioCompra>> listarPorProductoOrdenadosPorFecha(@PathVariable Long productoId) {
        List<HistoricoPrecioCompra> lista = historicoPrecioCompraService.listarPorProductoOrdenadosPorFecha(productoId);
        if (lista.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(lista);
    }

}
