package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "localidad_id")
    @JsonBackReference
    private Localidad localidad;

    @OneToMany(mappedBy = "domicilio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<DomicilioCliente> domicilioClientes = new HashSet<>();
}

