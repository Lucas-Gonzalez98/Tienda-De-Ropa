package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.DomicilioCliente;
import com.tienda_ropa.ecommerce.repository.DomicilioClienteRepository;
import com.tienda_ropa.ecommerce.service.DomicilioClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DomicilioClienteServiceImpl extends MasterServiceImpl<DomicilioCliente, Long> implements DomicilioClienteService {

    @Autowired
    public DomicilioClienteServiceImpl(DomicilioClienteRepository domicilioClienteRepository) {
        super(domicilioClienteRepository);
    }

}