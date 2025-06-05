package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;

import java.util.Set;

public interface ProductoService extends MasterService<Producto, Long> {

    Producto crearProductoCompleto(Producto producto, Set<Stock> stockInicial,
                                   Double precioVentaInicial, Double precioCompraInicialOpcional);
}