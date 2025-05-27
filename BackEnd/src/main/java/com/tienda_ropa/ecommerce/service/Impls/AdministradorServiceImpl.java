package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Administrador;
import com.tienda_ropa.ecommerce.repository.AdministradorRepository;
import com.tienda_ropa.ecommerce.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdministradorServiceImpl extends MasterServiceImpl<Administrador, Long> implements AdministradorService {

    @Autowired
    public AdministradorServiceImpl(AdministradorRepository administradorRepository) {
        super(administradorRepository);
    }

}