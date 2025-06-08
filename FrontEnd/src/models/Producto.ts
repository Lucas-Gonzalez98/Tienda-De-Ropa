import type Categoria from "./Categoria";
import type Color from "./Color";
import type HistoricoPrecioVenta from "./HistoricoPrecioVenta";
import type ImagenProducto from "./ImagenProducto";
import type Talle from "./Talle";

export default class Producto {
    id?: number;
    nombre: string = "";
    descripcion: string = "";
    imagenes!: ImagenProducto[];
    talle?: Talle;
    color?: Color;  
    precio?: number;
    historicoPreciosVenta!: HistoricoPrecioVenta[];
    categorias!: Categoria[];
    eliminado!: boolean;
}