import type Color from "./Color";
import type Producto from "./Producto";
import type Talle from "./Talle";

export default class Stock {
    id!: number;
    cantidad: number = 0;
    producto!: Producto;
    color!: Color;
    talle!: Talle;
    eliminado!: boolean;
}