import Producto from "./Producto";
import Pedido from "./Pedido";

export default class PedidoDetalle {
    id?: number;
    cantidad: number = 0;
    precio: number = 0;
    pedido!: Pedido;
    producto!: Producto;
    eliminado!: boolean;
}