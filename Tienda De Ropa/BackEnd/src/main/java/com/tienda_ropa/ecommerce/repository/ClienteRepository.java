package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Cliente;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends MasterRepository<Cliente, Long> {
}