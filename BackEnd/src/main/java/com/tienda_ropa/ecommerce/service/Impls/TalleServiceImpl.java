package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Talle;
import com.tienda_ropa.ecommerce.repository.TalleRepository;
import com.tienda_ropa.ecommerce.service.TalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TalleServiceImpl extends MasterServiceImpl<Talle, Long> implements TalleService {

    @Autowired
    public TalleServiceImpl(TalleRepository talleRepository) {
        super(talleRepository);
    }

}