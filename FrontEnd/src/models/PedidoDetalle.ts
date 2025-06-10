import Stock from "./Stock";
import Pedido from "./Pedido";

export default class PedidoDetalle {
    id?: number;
    cantidad: number = 0;
    precio: number = 0;
    pedido!: Pedido;
    stock!: Stock;
    eliminado!: boolean;
}