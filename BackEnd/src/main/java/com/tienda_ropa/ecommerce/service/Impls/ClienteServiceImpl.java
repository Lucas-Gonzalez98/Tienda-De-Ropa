package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Cliente;
import com.tienda_ropa.ecommerce.repository.ClienteRepository;
import com.tienda_ropa.ecommerce.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteServiceImpl extends MasterServiceImpl<Cliente, Long> implements ClienteService {

    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        super(clienteRepository);
    }

}