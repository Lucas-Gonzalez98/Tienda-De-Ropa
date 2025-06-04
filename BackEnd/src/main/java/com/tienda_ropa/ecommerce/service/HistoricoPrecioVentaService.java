package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;

import java.util.List;
import java.util.Optional;

public interface HistoricoPrecioVentaService extends MasterService<HistoricoPrecioVenta, Long> {

    Optional<HistoricoPrecioVenta> obtenerUltimoPorProducto(Long productoId);

    List<HistoricoPrecioVenta> listarTodosOrdenadosPorFecha();

    List<HistoricoPrecioVenta> listarPorProductoOrdenadosPorFecha(Long productoId);
}