package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "usuario_cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioCliente extends Master {

    private String username;
    private String password;

    @OneToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
}
