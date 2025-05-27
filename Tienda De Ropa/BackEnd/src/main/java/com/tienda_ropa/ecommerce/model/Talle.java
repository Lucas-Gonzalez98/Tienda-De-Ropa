package com.tienda_ropa.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Talle extends Master {

    private String nombre;
}
