package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Administrador;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends MasterRepository<Administrador, Long> {

    Optional<Administrador> findByUsuarioId(Long usuarioId);
}