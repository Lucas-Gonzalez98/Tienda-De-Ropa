package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido extends Master {

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonBackReference("cliente-pedido")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "domicilio_id", nullable = false)
    private Domicilio domicilio;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("pedido-detalle")
    private Set<PedidoDetalle> detalles = new HashSet<>();
}

