package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Categoria;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends MasterRepository<Categoria, Long> {
    @Query("SELECT c FROM Categoria c WHERE c.id <> (SELECT MIN(c2.id) FROM Categoria c2)")
    List<Categoria> findAllExcludingFirst();

    List<Categoria> findByDenominacion(String denominacion);
}