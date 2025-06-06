import type Categoria from "./Categoria";
import type Color from "./Color";
import type ImagenProducto from "./ImagenProducto";
import type Promocion from "./Promocion";
import type Talle from "./Talle";

export default class Pedido {
    id?: number;
    nombre: string = "";
    descripcion: string = "";
    imagenes!: ImagenProducto[];
    talle?: Talle;
    color?: Color;  
    precio?: number;
    categorias!: Categoria[];
    eliminado!: boolean;
}