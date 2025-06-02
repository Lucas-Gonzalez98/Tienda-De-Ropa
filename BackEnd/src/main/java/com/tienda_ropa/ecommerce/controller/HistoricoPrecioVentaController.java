package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioVentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico-precio-ventas")
public class HistoricoPrecioVentaController extends MasterController<HistoricoPrecioVenta, Long> {

    private final HistoricoPrecioVentaService historicoPrecioVentaService;

    public HistoricoPrecioVentaController(HistoricoPrecioVentaService historicoPrecioVentaService) {
        super(historicoPrecioVentaService);
        this.historicoPrecioVentaService = historicoPrecioVentaService;
    }



}