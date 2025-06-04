import Producto from "./Producto";

export default class HistoricoPrecioCompra {
    id?: number;
    precio: number = 0;
    fecha: Date = new Date();
    producto!: Producto;
    eliminado!: boolean;
}