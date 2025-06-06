package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;

import java.util.List;

public interface StockService extends MasterService<Stock, Long> {

    //filtrar por talle y color
    List<Stock> getDisponiblesPorTalleYColor(Talle talle, Color color);
    //obtener todos los stock con cantidad > 0
    List<Stock> getDisponibles();
    // cantidad de stock por producto, talle y color)
    int obtenerCantidadStockDisponible(Producto producto, Talle talle, Color color);

    // actualizar stock para una combinación
    Stock actualizarCantidad(Long idProducto, Long idColor, Long idTalle, Integer nuevaCantidad);

}