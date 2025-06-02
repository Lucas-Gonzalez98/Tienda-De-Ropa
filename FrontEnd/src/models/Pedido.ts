import type Cliente from "./Cliente";
import type DetallePedido from "./DetallePedido";
import type { Estado } from "./enums/Estado";
import type { FormaPago } from "./enums/FormaPago";
import type { TipoEnvio } from "./enums/TipoEnvio";
import type Factura from "./Factura";

export default class Pedido {
    id?: number;
    horaEstimadaFinalizacion: Date = new Date();
    total: number = 0;
    totalCosto: number = 0;
    estado!: Estado;
    tipoEnvio!: TipoEnvio;
    formaPago!: FormaPago;
    fechaPedido: Date = new Date();
    cliente!: Cliente;
    factura?: Factura;
    detalle: DetallePedido[] = [];
    eliminado!: boolean;
}