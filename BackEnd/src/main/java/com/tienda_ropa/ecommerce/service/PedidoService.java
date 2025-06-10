package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import com.tienda_ropa.ecommerce.model.enums.Rol;

import java.time.LocalDate;
import java.util.List;

public interface PedidoService extends MasterService<Pedido, Long> {

    //obtener el historial de pedidos de un cliente específico
    List<Pedido> getByClienteId(Long clienteId);

    //Realizar un pedido
    Pedido realizarPedido(Pedido pedido, Long clienteId, Long domicilioId);

    //búsqueda filtrada para ver pedidos realizados
    List<Pedido> getByFiltros(Long clienteId, String estado, LocalDate fechaDesde, LocalDate fechaHasta);

    //actualizar el estado del pedido
    void cambiarEstadoPedido(Long pedidoId, Estado nuevoEstado, Long usuarioId, Rol rol);

    //Cambiar estado del Pedido Dependiendo de el Pago de Mercado Pago
    void actualizarEstadoPorPago(Long pedidoId, String paymentStatus);

}