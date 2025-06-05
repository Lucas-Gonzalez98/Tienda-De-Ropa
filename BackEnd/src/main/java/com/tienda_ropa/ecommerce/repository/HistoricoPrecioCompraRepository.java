package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HistoricoPrecioCompraRepository extends MasterRepository<HistoricoPrecioCompra, Long> {

    @Query("SELECT h FROM HistoricoPrecioCompra h WHERE h.producto.id = :productoId AND h.eliminado = false ORDER BY h.fecha DESC LIMIT 1")
    Optional<HistoricoPrecioCompra> findUltimoByProductoId(Long productoId);

    List<HistoricoPrecioCompra> findAllByEliminadoFalseOrderByFechaDesc();

    List<HistoricoPrecioCompra> findAllByProductoIdAndEliminadoFalseOrderByFechaDesc(Long productoId);
}