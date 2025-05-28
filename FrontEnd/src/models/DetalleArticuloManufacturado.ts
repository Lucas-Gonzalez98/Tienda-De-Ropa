import ArticuloInsumo from "./ArticuloInsumo";

export default class DetalleArticuloManufacturado {
    id?: number;
    cantidad: number = 0;
    articuloInsumo?: ArticuloInsumo;
    eliminado!: boolean;
}