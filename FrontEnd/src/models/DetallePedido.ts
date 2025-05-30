import Articulo from "./Articulo";

export default class DetallePedido {
    id?: number;
    cantidad: number = 0;
    subTotal: number = 0;
    articulo!: Articulo;
    eliminado!: boolean;
}