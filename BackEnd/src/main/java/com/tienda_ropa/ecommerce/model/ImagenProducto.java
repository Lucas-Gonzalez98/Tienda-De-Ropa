package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagen_producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagenProducto extends Master {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonIgnore
    private Producto producto;
}

