package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.ImagenProducto;

import java.util.List;

public interface ImagenProductoRepository extends MasterRepository<ImagenProducto, Long> {

    //obtener imágenes por producto
    List<ImagenProducto> findByProductoId(Long idProducto);

}