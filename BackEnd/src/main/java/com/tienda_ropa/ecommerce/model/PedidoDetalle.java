package com.tienda_ropa.ecommerce.model;

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
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;
}
