package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioVentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/historico-precio-ventas")
@CrossOrigin(origins ="*")
public class HistoricoPrecioVentaController extends MasterController<HistoricoPrecioVenta, Long> {

    private final HistoricoPrecioVentaService historicoPrecioVentaService;

    public HistoricoPrecioVentaController(HistoricoPrecioVentaService historicoPrecioVentaService) {
        super(historicoPrecioVentaService);
        this.historicoPrecioVentaService = historicoPrecioVentaService;
    }

    @GetMapping("/ultimo/{productoId}")
    public ResponseEntity<HistoricoPrecioVenta> obtenerUltimoPorProducto(@PathVariable Long productoId) {
        return historicoPrecioVentaService.obtenerUltimoPorProducto(productoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ordenado")
    public ResponseEntity<List<HistoricoPrecioVenta>> listarTodosOrdenadosPorFecha() {
        List<HistoricoPrecioVenta> lista = historicoPrecioVentaService.listarTodosOrdenadosPorFecha();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<HistoricoPrecioVenta>> listarPorProductoOrdenadosPorFecha(@PathVariable Long productoId) {
        List<HistoricoPrecioVenta> lista = historicoPrecioVentaService.listarPorProductoOrdenadosPorFecha(productoId);
        if (lista.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(lista);
    }

}