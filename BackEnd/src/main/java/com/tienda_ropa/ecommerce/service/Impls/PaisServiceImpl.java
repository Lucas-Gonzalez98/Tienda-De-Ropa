package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Pais;
import com.tienda_ropa.ecommerce.repository.PaisRepository;
import com.tienda_ropa.ecommerce.service.PaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaisServiceImpl extends MasterServiceImpl<Pais, Long> implements PaisService {

    @Autowired
    public PaisServiceImpl(PaisRepository paisRepository) {
        super(paisRepository);
    }



}