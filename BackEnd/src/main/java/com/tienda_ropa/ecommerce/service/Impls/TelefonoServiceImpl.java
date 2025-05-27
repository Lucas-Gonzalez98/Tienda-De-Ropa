package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Telefono;
import com.tienda_ropa.ecommerce.repository.TelefonoRepository;
import com.tienda_ropa.ecommerce.service.TelefonoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TelefonoServiceImpl extends MasterServiceImpl<Telefono, Long> implements TelefonoService {

    @Autowired
    public TelefonoServiceImpl(TelefonoRepository telefonoRepository) {
        super(telefonoRepository);
    }

}