package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.PromocionDetalle;
import com.tienda_ropa.ecommerce.repository.PromocionDetalleRepository;
import com.tienda_ropa.ecommerce.service.PromocionDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromocionDetalleServiceImpl extends MasterServiceImpl<PromocionDetalle, Long> implements PromocionDetalleService {

    @Autowired
    public PromocionDetalleServiceImpl(PromocionDetalleRepository promocionDetalleRepository) {
        super(promocionDetalleRepository);
    }

}