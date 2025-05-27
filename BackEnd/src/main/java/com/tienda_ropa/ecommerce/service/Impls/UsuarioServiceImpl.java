package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Usuario;
import com.tienda_ropa.ecommerce.repository.UsuarioRepository;
import com.tienda_ropa.ecommerce.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl extends MasterServiceImpl<Usuario, Long> implements UsuarioService {

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        super(usuarioRepository);
    }

}