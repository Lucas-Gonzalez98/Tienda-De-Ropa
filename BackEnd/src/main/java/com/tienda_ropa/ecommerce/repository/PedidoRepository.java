package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Pedido;

import java.util.List;

public interface PedidoRepository extends MasterRepository<Pedido, Long> {

    //obtener el historial de pedidos de un cliente específico
    List<Pedido> findByClienteIdAndEliminadoFalse(Long clienteId);
}