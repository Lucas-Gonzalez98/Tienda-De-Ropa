package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Categoria;
import com.tienda_ropa.ecommerce.repository.CategoriaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CategoriaService extends MasterService<Categoria, Long> {

    List<Categoria> findAllExcludingFirst();
    List<Categoria> findByDenominacion(String denominacion);
    List<Categoria> getAllTree();
}