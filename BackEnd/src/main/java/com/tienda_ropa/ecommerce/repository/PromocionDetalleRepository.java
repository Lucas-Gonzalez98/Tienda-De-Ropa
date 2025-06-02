package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Promocion;
import com.tienda_ropa.ecommerce.model.PromocionDetalle;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.*;
import java.util.List;

public interface PromocionDetalleRepository extends MasterRepository<PromocionDetalle, Long> {

}