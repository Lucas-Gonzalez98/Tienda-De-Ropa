package com.tienda_ropa.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "talle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Talle extends Master {

    private String nombre;
}


