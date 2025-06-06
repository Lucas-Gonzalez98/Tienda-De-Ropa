package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.ImagenProducto;

import java.util.List;

public interface ImagenProductoService extends MasterService<ImagenProducto, Long> {

    //agregar imagen a producto
    ImagenProducto agregarImagen(Long idProducto, String base64);

    // esta función hace referencia a: obtener todas las imágenes de un producto
    List<ImagenProducto> obtenerPorProducto(Long idProducto);

}