package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;

import java.util.List;
import java.util.Set;

public interface ProductoService extends MasterService<Producto, Long> {


    //Guardar un producto (CREAR)
    Producto crearProductoCompleto(Producto producto, Set<Stock> stock,
                                   Double precioVentaInicial, Double precioCompraInicialOpcional,
                                   List<String> imagenesBase64);
}