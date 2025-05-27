package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Provincia;
import com.tienda_ropa.ecommerce.repository.ProvinciaRepository;
import com.tienda_ropa.ecommerce.service.ProvinciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProvinciaServiceImpl extends MasterServiceImpl<Provincia, Long> implements ProvinciaService {

    @Autowired
    public ProvinciaServiceImpl(ProvinciaRepository provinciaRepository) {
        super(provinciaRepository);
    }

}