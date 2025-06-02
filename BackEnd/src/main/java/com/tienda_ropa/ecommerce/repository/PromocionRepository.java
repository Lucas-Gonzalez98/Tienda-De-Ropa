package com.tienda_ropa.ecommerce.repository;

import com.tienda_ropa.ecommerce.model.Promocion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface PromocionRepository extends MasterRepository<Promocion, Long> {

    //TODO Este query esta mal, hay que arreglarlo y hacerlo bien.
    //Ver promociones vigentes
    @Query("""
        SELECT p FROM Promocion p
        LEFT JOIN FETCH p.imagenes
        LEFT JOIN FETCH p.detalles d
        LEFT JOIN FETCH d.producto prod
        LEFT JOIN FETCH prod.imagenes
        WHERE p.eliminado = false
          AND :now BETWEEN p.fechaDesde AND p.fechaHasta
          AND :hora BETWEEN p.horaDesde AND p.horaHasta
    """)
    List<Promocion> findPromocionesVigentes(@Param("now") LocalDateTime now, @Param("hora") LocalTime hora);
}