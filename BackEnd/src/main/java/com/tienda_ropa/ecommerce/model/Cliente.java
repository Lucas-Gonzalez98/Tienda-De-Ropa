package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends Master {

    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;

    @ManyToOne  // REMOVER cascade, se maneja en el service
    @JoinColumn(name = "id_telefono", nullable = false)
    private Telefono telefono;

    @OneToOne  // REMOVER cascade, se maneja en el service
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario;

    @ManyToMany(cascade = CascadeType.PERSIST)  // Solo PERSIST para domicilios
    @JoinTable(
            name = "cliente_domicilio",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "domicilio_id")
    )
    private Set<Domicilio> domicilios = new HashSet<>();
}