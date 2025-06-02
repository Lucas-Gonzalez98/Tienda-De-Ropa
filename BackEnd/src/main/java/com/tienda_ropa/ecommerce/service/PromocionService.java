package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Promocion;

import java.util.List;

public interface PromocionService extends MasterService<Promocion, Long> {

    //Ver promociones vigentes
    List<Promocion> getPromocionesVigentes();
}