package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Promocion;
import com.tienda_ropa.ecommerce.repository.PromocionRepository;
import com.tienda_ropa.ecommerce.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;

@Service
public class PromocionServiceImpl extends MasterServiceImpl<Promocion, Long> implements PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionServiceImpl(PromocionRepository promocionRepository) {
        super(promocionRepository);
        this.promocionRepository = promocionRepository;
    }

    //Ver promociones vigentes
    @Override
    @Transactional
    public List<Promocion> getPromocionesVigentes() {
        return promocionRepository.findPromocionesVigentes(LocalDateTime.now(), LocalTime.now());
    }

}