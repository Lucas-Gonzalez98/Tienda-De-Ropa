import Existencia from "./Existencia";
import ArticuloInsumo from "./ArticuloInsumo";

export default class SucursalInsumo {
    id?: number;
    stockMinimo: number = 0;
    stockMaximo: number = 0;
    existencias: Existencia[] = [];
    articulosInsumo: ArticuloInsumo[] = [];
    eliminado!: boolean;
}