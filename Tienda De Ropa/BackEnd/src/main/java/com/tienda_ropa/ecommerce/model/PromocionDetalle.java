package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promocion_detalle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromocionDetalle extends Master {

    private Integer cantidad;

    @ManyToOne
    @JoinColumn(name = "id_promocion", nullable = false)
    private Promocion promocion;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;
}
