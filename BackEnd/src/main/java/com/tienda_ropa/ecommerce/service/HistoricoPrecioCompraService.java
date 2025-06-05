package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;

import java.util.*;

public interface HistoricoPrecioCompraService extends MasterService<HistoricoPrecioCompra, Long> {

    Optional<HistoricoPrecioCompra> obtenerUltimoPorProducto(Long productoId);

    List<HistoricoPrecioCompra> listarTodosOrdenadosPorFecha();

    List<HistoricoPrecioCompra> listarPorProductoOrdenadosPorFecha(Long productoId);
}