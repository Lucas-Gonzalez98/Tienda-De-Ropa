package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Pedido;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PedidoRepository extends MasterRepository<Pedido, Long> {

    //obtener el historial de pedidos de un cliente específico
    List<Pedido> findByClienteIdAndEliminadoFalse(Long clienteId);

    // listar pedidos filtrando por cliente, estado y fecha
    @Query("SELECT p FROM Pedido p WHERE p.eliminado = false "
            + "AND (:clienteId IS NULL OR p.cliente.id = :clienteId) "
            + "AND (:estado IS NULL OR p.estado = :estado) "
            + "AND (:fechaDesde IS NULL OR p.fecha >= :fechaDesde) "
            + "AND (:fechaHasta IS NULL OR p.fecha <= :fechaHasta)")
    List<Pedido> findByFiltros(
            @Param("clienteId") Long clienteId,
            @Param("estado") String estado,
            @Param("fechaDesde") LocalDate fechaDesde,
            @Param("fechaHasta") LocalDate fechaHasta
    );
}