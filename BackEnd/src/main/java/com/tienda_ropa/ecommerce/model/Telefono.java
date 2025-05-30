package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "telefono")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Telefono extends Master {

    private String numero;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cliente_id")
    @JsonBackReference
    private Cliente cliente;
}

