package com.tienda_ropa.ecommerce.model;

import com.tienda_ropa.ecommerce.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario_administrador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Master {

    private String email;

    private String FirebaseUid;

    private Rol Rol;

    @OneToOne
    @JoinColumn(name = "id_administrador", nullable = false)
    private Administrador administrador;
}
