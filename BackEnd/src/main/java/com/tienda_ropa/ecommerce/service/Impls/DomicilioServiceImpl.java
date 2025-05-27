package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Domicilio;
import com.tienda_ropa.ecommerce.repository.DomicilioRepository;
import com.tienda_ropa.ecommerce.service.DomicilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DomicilioServiceImpl extends MasterServiceImpl<Domicilio, Long> implements DomicilioService {

    @Autowired
    public DomicilioServiceImpl(DomicilioRepository domicilioRepository) {
        super(domicilioRepository);
    }

}