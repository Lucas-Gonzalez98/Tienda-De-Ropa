package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Cliente;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends MasterRepository<Cliente, Long> {
    Optional<Cliente> findByUsuarioId(Long usuarioId);
}