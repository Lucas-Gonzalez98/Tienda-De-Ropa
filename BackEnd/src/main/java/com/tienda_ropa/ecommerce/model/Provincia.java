package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "provincia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Provincia extends Master {

    private String nombre;

    @ManyToOne
    @JoinColumn(name = "id_pais", nullable = false)
    private Pais pais;

    @OneToMany(mappedBy = "provincia", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Localidad> localidades = new HashSet<>();
}