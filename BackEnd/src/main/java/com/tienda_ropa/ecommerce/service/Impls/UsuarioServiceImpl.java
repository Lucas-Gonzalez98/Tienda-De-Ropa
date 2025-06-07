package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Usuario;
import com.tienda_ropa.ecommerce.repository.UsuarioRepository;
import com.tienda_ropa.ecommerce.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UsuarioServiceImpl extends MasterServiceImpl<Usuario, Long> implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        super(usuarioRepository);
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Optional<Usuario> findByFirebaseUid(String firebaseUid) {
        return usuarioRepository.findByFirebaseUid(firebaseUid);
    }
    @Override
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }


    @Override
    @Transactional
    public Usuario save(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepository.findByFirebaseUid(usuario.getFirebaseUid());
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario con ese Firebase UID");
        }
        return super.save(usuario);
    }
}
