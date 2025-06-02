package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Administrador;
import com.tienda_ropa.ecommerce.repository.AdministradorRepository;
import com.tienda_ropa.ecommerce.repository.UsuarioRepository;
import com.tienda_ropa.ecommerce.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministradorServiceImpl extends MasterServiceImpl<Administrador, Long> implements AdministradorService {
    private final AdministradorRepository administradorRepository;

    @Autowired
    public AdministradorServiceImpl(AdministradorRepository administradorRepository) {
        super(administradorRepository);
        this.administradorRepository = administradorRepository;
    }

    @Override
    public Optional<Administrador> findByUsuarioId(Long usuarioId) {
        return administradorRepository.findByUsuarioId(usuarioId);
    }

}