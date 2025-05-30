package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonBackReference
    private Promocion promocion;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonIgnore
    private Producto producto;
}

