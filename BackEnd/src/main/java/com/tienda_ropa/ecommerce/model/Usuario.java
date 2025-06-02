package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tienda_ropa.ecommerce.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"administrador", "cliente"})
public class Usuario extends Master {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "firebase_uid", nullable = false, unique = true)
    private String firebaseUid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
    // Agregar esta referencia bidireccional
    @OneToOne(mappedBy = "usuario")
    @JsonBackReference
    private Cliente cliente;

}
