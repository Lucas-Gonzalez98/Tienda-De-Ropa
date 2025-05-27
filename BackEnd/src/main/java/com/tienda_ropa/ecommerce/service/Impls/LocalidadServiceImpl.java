package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Localidad;
import com.tienda_ropa.ecommerce.repository.LocalidadRepository;
import com.tienda_ropa.ecommerce.service.LocalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocalidadServiceImpl extends MasterServiceImpl<Localidad, Long> implements LocalidadService {

    @Autowired
    public LocalidadServiceImpl(LocalidadRepository localidadRepository) {
        super(localidadRepository);
    }

}