package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HistoricoPrecioCompraRepository extends MasterRepository<HistoricoPrecioCompra, Long> {

    @Query("SELECT h FROM HistoricoPrecioCompra h WHERE h.producto.id = :productoId AND h.eliminado = false ORDER BY h.fecha DESC LIMIT 1")
    Optional<HistoricoPrecioCompra> findUltimoByProductoId(Long productoId);

    List<HistoricoPrecioCompra> findAllByEliminadoFalseOrderByFechaDesc();

    List<HistoricoPrecioCompra> findAllByProductoIdAndEliminadoFalseOrderByFechaDesc(Long productoId);

    //para el update de producto
    boolean existsByProductoIdAndPrecio(Long productoId, Double precio);

    //Buscar el ultimo precio compra
    Optional<HistoricoPrecioCompra> findTopByProductoIdOrderByFechaDesc(Long productoId);

    @Query("SELECT h FROM HistoricoPrecioCompra h WHERE h.producto.id = :productoId ORDER BY h.fecha DESC")
    List<HistoricoPrecioCompra> findUltimosByProductoId(@Param("productoId") Long productoId, Pageable pageable);
}