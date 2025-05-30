package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.*;

@Entity
@Table(name = "historico_precio_venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoPrecioVenta extends Master {

    private Double precio;

    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonIgnore
    private Producto producto;
}

