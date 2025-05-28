import Articulo from "./Articulo";

export default class HistoricoPrecioCompra {
    id?: number;
    precio: number = 0;
    fecha: Date = new Date();
    articulo!: Articulo;
    eliminado!: boolean;
}