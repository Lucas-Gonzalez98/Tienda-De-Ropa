package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Categoria;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends MasterRepository<Categoria, Long> {
}