package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;

import java.util.*;

public interface ProductoService extends MasterService<Producto, Long> {

    /*
    //Guardar un producto (CREAR)
    Producto crearProducto(Producto producto, Set<Stock> stock,
                                   Double precioVentaInicial, Double precioCompraInicialOpcional,
                                   List<String> imagenesBase64);


     */
    //Editar un producto (solo su Categoria, precios, y caracteristicas)
    Producto editarProducto(Long id, Producto producto);
}