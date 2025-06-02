package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @ManyToOne
    @JoinColumn(name = "id_telefono", nullable = false)
    private Telefono telefono;

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    @JsonManagedReference
    private Usuario usuario;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "cliente_domicilio",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "domicilio_id")
    )
    private Set<Domicilio> domicilios = new HashSet<>();

}

