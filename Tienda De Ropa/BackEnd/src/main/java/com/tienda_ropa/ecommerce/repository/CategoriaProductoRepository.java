package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.CategoriaProducto;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaProductoRepository extends MasterRepository<CategoriaProducto, Long> {
}