package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "domicilio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Domicilio extends Master {

    private String calle;
    private String numero;
    private Integer codigoPostal;
    private String referencia;

    @ManyToOne  // REMOVER cascade = CascadeType.ALL
    @JoinColumn(name = "localidad_id")
    private Localidad localidad;
}