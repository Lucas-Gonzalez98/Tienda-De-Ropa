package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Administrador extends Master {

    private String nombre;
    private String apellido;

    @ManyToOne
    @JoinColumn(name = "id_telefono", nullable = false)
    private Telefono telefono;

    @ManyToOne
    @JoinColumn(name = "id_domicilio", nullable = false)
    private Domicilio domicilio;

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    @JsonManagedReference
    private Usuario usuarioAdministrador;
}
