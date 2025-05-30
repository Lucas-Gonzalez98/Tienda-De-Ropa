package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "domicilio_cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DomicilioCliente extends Master {

    @ManyToOne
    @JoinColumn(name = "domicilio_id", nullable = false)
    @JsonBackReference
    private Domicilio domicilio;

    @OneToOne
    @JoinColumn(name = "cliente_id", nullable = false, unique = true)
    @JsonManagedReference
    private Cliente cliente;
}
