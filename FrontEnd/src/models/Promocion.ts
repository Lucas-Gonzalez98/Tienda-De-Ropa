import DetallePromocion from "./DetallePromocion";
import type { TipoPromocion } from "./enums/TipoPromocion";
import Imagen from "./ImagenPromocion";

export default class Promocion {
    id?: number;
    denominacion: string = "";
    fechaDesde: Date = new Date();
    fechaHasta: Date = new Date();
    horaDesde: Date = new Date();
    horaHasta: Date = new Date();
    descripcionDescuento: string = "";
    precioPromocional: number = 0;
    tipo!: TipoPromocion;
    imagenes: Imagen[] = [];
    detalle: DetallePromocion[] = [];
    activa: boolean = false;
    eliminado!: boolean;
}