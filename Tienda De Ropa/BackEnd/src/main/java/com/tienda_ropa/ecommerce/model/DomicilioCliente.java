package com.tienda_ropa.ecommerce.model;

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
    @JoinColumn(name = "domicilio_id")
    private Domicilio domicilio;

    @OneToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
}
