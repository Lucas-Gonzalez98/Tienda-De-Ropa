package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario_administrador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioAdministrador extends Master {

    private String email;

    @Column(name = "password")
    private String password;

    @OneToOne
    @JoinColumn(name = "id_administrador", nullable = false)
    private Administrador administrador;
}
