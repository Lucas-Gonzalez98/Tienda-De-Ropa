package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Usuario;

import java.util.Optional;

public interface UsuarioService extends MasterService<Usuario, Long> {
    Optional<Usuario> findByFirebaseUid(String firebaseUid);
    Optional<Usuario> findByEmail(String email);
}