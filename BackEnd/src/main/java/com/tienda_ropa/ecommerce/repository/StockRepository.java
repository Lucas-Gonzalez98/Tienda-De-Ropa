package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;

import java.util.List;

public interface StockRepository extends MasterRepository<Stock, Long> {

    //filtra stock por talle, color y disponibilidad
    List<Stock> findByTalleAndColorAndCantidadGreaterThan(Talle talle, Color color, int cantidad);

    //filtra todos los stocks con productos disponibles
    List<Stock> findByCantidadGreaterThan(int cantidad);
}