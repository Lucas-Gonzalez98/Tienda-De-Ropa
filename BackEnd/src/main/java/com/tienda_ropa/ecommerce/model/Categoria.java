package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Categoria extends Master {

    private String denominacion;

    @ManyToOne
    @JoinColumn(name = "id_categoria_padre")
    private Categoria categoriaPadre;

    @OneToMany(mappedBy = "categoriaPadre", cascade = CascadeType.ALL)
    private Set<Categoria> subcategorias = new HashSet<>();
}