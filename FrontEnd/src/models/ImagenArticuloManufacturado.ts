import type ArticuloManufacturado from "./ArticuloManufacturado";

export default class ImagenArticuloManufacturado {
    id?: number;
    denominacion: string = "";
    articuloManufacturado!: ArticuloManufacturado;
    eliminado!: boolean;
}