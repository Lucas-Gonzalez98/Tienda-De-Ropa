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
    private String piso;
    private String nroDepartamento;
    private String detalles;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "localidad_id")
    private Localidad localidad;

    @OneToMany(mappedBy = "domicilio", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DomicilioCliente> domicilioClientes = new HashSet<>();
}
