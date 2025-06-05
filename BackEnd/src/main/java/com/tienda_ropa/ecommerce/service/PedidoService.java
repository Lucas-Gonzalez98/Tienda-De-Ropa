package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Pedido;

import java.util.List;

public interface PedidoService extends MasterService<Pedido, Long> {

    //obtener el historial de pedidos de un cliente específico
    List<Pedido> getByClienteId(Long clienteId);

    //Realizar un pedido
    Pedido realizarPedido(Pedido pedido, Long clienteId, Long domicilioId);

}