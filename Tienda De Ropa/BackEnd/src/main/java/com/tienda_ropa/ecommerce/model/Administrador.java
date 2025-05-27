package com.tienda_ropa.ecommerce.model;

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

    @OneToOne(mappedBy = "administrador", cascade = CascadeType.ALL, orphanRemoval = true)
    private UsuarioAdministrador usuarioAdministrador;
}