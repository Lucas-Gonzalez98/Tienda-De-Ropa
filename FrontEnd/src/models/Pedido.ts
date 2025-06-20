import type Cliente from "./Cliente";
import type PedidoDetalle from "./PedidoDetalle";
import type Domicilio from "./Domicilio.ts";
import type { Estado } from "./enums/Estado.ts";

export default class Pedido {
    id?: number;
    fecha: Date = new Date();
    estado!: Estado;
    cliente!: Cliente;
    detalles: PedidoDetalle[] = [];
    domicilio!: Domicilio;
    eliminado!: boolean;
}