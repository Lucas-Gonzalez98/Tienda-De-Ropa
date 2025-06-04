import type Cliente from "./Cliente";
import type PedidoDetalle from "./PedidoDetalle";

export default class Pedido {
    id?: number;
    fecha: Date = new Date();
    estado: String = "";
    cliente!: Cliente;
    detalles: PedidoDetalle[] = [];
    eliminado!: boolean;
}