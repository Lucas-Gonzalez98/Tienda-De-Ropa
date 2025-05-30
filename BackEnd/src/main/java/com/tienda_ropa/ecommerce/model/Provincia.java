package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonManagedReference
    private Pais pais;

    @OneToMany(mappedBy = "provincia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private Set<Localidad> localidades = new HashSet<>();
}
