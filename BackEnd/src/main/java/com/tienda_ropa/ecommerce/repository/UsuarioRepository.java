package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends MasterRepository<Usuario, Long> {

        Optional<Usuario> findByFirebaseUid(String firebaseUid);
        Optional<Usuario> findByEmail(String email);

}