package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedido_detalle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDetalle extends Master {

    private int cantidad;
    private double precio;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonBackReference
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    @JsonManagedReference
    private Producto producto;
}

