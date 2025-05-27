package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Master;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;

public interface MasterService<E extends Master, ID extends Serializable> {
    E save(E entity); // Guarda una nueva entidad
    E getById(ID id); // Busca por ID
    List<E> getAll(); // Devuelve todas las entidades no eliminadas
    Page<E> getAll(Pageable pageable); // Soporte para paginación
    E update(ID id, E entity); // Actualiza la entidad por ID
    void delete(ID id); // Eliminación lógica
    List<E> getAllIncludingDeleted(); // Devuelve todas las entidades, incluyendo las eliminadas
    void restore(ID id); // Realiza el alta lógica de una entidad previamente eliminada
}