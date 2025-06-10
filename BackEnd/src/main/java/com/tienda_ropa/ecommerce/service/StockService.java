package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;

import java.util.List;
import java.util.Optional;

public interface StockService extends MasterService<Stock, Long> {

    // Métodos existentes
    List<Stock> getDisponiblesPorTalleYColor(Talle talle, Color color);
    List<Stock> getDisponibles();
    int obtenerCantidadStockDisponible(Producto producto, Talle talle, Color color);
    List<Stock> getByProducto(Long productoId);
    Optional<Stock> getStock(Long idProducto, Long idColor, Long idTalle);

    // Métodos mejorados para los tres botones
    Stock crearStock(Long idProducto, Long idColor, Long idTalle, Integer cantidad,
                     Double precioCompra);

    Stock agregarStock(Long idProducto, Long idColor, Long idTalle, Integer cantidadAdicional,
                       Double precioCompra);

    Stock actualizarStock(Long stockId, Long idProducto, Long idColor, Long idTalle,
                          Integer nuevaCantidad, Double precioCompra);

    // Métodos auxiliares para validar precios
    boolean esPrecioCompraDiferente(Long productoId, Double nuevoPrecio);
    boolean esPrecioVentaDiferente(Long productoId, Double nuevoPrecio);
    Double obtenerUltimoPrecioCompra(Long productoId);
    Double obtenerUltimoPrecioVenta(Long productoId);


}