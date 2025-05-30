package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagen_promocion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagenPromocion extends Master {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "id_promocion", nullable = false)
    @JsonBackReference
    private Promocion promocion;
}

