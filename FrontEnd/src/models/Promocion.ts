import type ImagenPromocion from "./ImagenPromocion";
import PromocionDetalle from "./PromocionDetalle";

export default class Promocion {
    id?: number;
    denominacion: string = "";
    fechaDesde: Date = new Date();
    fechaHasta: Date = new Date();
    horaDesde: Date = new Date();
    horaHasta: Date = new Date();
    descripcionDescuento: string = "";
    precioPromocional: number = 0;
    tipo?: String;
    imagenes?: ImagenPromocion[];
    detalle?: PromocionDetalle[];    activa: boolean = false;
    eliminado!: boolean;
}