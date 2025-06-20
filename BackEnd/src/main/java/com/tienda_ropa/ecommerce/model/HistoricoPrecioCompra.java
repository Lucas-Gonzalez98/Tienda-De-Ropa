package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.*;

@Entity
@Table(name = "historico_precio_compra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoPrecioCompra extends Master {

    private Double precio;

    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonBackReference("producto-historico-compra")
    private Producto producto;
}

