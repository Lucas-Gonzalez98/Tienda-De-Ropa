package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Administrador;

import java.util.Optional;

public interface AdministradorService extends MasterService<Administrador, Long> {
    public Optional<Administrador> findByUsuarioId(Long usuarioId);

}