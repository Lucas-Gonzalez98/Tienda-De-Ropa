package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioCompraService;
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



}
