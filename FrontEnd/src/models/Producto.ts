import type Color from "./Color";
import type ImagenProducto from "./ImagenProducto";
import type Talle from "./Talle";

export default class Pedido {
    id!: number;
    nombre: string = "";
    descripcion: string = "";
    precio: number = 0;
    imagenes!: ImagenProducto[];
    talle?: Talle;
    color?: Color;
    eliminado!: boolean;
}