package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Master;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface MasterRepository <E extends Master, ID extends Serializable> extends JpaRepository<E, ID> {

    @Transactional
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.eliminado = true WHERE e.id = :id")
    void bajaLogica(@Param("id") ID id);

    List<E> findAllByEliminadoFalse();

    Optional<E> findByIdAndEliminadoFalse(ID id);

    Page<E> findAllByEliminadoFalse(Pageable pageable);
    // Devuelve todas las entidades, sin filtrar por eliminado
    List<E> findAll();

    // Revierte la eliminación lógica (alta lógica)
    @Transactional
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.eliminado = false WHERE e.id = :id")
    void altaLogica(@Param("id") ID id);

}
