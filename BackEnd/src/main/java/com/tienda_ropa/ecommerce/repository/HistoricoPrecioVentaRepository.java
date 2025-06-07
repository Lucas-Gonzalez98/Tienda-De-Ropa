package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;
import com.tienda_ropa.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HistoricoPrecioVentaRepository extends MasterRepository<HistoricoPrecioVenta, Long> {

    @Query("SELECT h FROM HistoricoPrecioVenta h WHERE h.producto.id = :productoId AND h.eliminado = false ORDER BY h.fecha DESC LIMIT 1")
    Optional<HistoricoPrecioVenta> findUltimoByProductoId(Long productoId);

    List<HistoricoPrecioVenta> findAllByEliminadoFalseOrderByFechaDesc();

    List<HistoricoPrecioVenta> findAllByProductoIdAndEliminadoFalseOrderByFechaDesc(Long productoId);

    //para el update de producto
    boolean existsByProductoIdAndPrecio(Long productoId, Double precio);

    Optional<HistoricoPrecioVenta> findTopByProductoOrderByFechaDesc(Producto producto);
}