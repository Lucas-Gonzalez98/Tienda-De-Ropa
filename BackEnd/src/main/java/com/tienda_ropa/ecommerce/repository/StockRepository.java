package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends MasterRepository<Stock, Long> {

    //filtra stock por talle, color y disponibilidad
    List<Stock> findByTalleAndColorAndCantidadGreaterThan(Talle talle, Color color, int cantidad);

    //filtra todos los stocks con productos disponibles
    List<Stock> findByCantidadGreaterThan(int cantidad);

    // cantidad de stock por producto, talle y color)
    @Query("SELECT COALESCE(SUM(s.cantidad), 0) FROM Stock s WHERE s.producto = :producto AND s.talle = :talle AND s.color = :color")
    int obtenerCantidadStockDisponible(@Param("producto") Producto producto,
                                       @Param("talle") Talle talle,
                                       @Param("color") Color color);


}