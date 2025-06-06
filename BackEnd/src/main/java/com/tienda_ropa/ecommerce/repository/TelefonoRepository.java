package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Telefono;

import java.util.Optional;

public interface TelefonoRepository extends MasterRepository<Telefono, Long>
{
    Optional<Telefono> findByNumero(String numero);

}