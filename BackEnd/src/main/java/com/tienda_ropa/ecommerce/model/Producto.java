package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto extends Master {

    private String nombre;
    private String descripcion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<ImagenProducto> imagenes = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "categoria_producto",
            joinColumns = @JoinColumn(name = "id_producto"),
            inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private Set<Categoria> categorias = new HashSet<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("producto-historico-venta")
    private Set<HistoricoPrecioVenta> historicoPreciosVenta = new HashSet<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("producto-historico-compra")
    private Set<HistoricoPrecioCompra> historicoPreciosCompra = new HashSet<>();


    //Esto es para realizar un pedido
    @Transient
    private Color color;

    @Transient
    private Talle talle;

}

