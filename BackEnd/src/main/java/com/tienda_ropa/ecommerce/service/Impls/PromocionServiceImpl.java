package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Promocion;
import com.tienda_ropa.ecommerce.repository.PromocionRepository;
import com.tienda_ropa.ecommerce.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromocionServiceImpl extends MasterServiceImpl<Promocion, Long> implements PromocionService {

    @Autowired
    public PromocionServiceImpl(PromocionRepository promocionRepository) {
        super(promocionRepository);
    }

}