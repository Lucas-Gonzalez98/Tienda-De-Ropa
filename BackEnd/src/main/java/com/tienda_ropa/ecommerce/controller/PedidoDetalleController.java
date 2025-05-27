package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.PedidoDetalle;
import com.tienda_ropa.ecommerce.service.PedidoDetalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedido-detalle")
public class PedidoDetalleController extends MasterController<PedidoDetalle, Long> {

    private final PedidoDetalleService PedidoDetalleService;

    public PedidoDetalleController(PedidoDetalleService PedidoDetalleService) {
        super(PedidoDetalleService);
        this.PedidoDetalleService = PedidoDetalleService;
    }



}