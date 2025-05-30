import type Articulo from "./Articulo";

export default class DetallePromocion {
    id?: number;
    cantidad: number = 0;
    articulo!: Articulo;
    eliminado!: boolean;
}