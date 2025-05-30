package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categoria_producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaProducto extends Master {

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;
}

