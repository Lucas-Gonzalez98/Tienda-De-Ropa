import Pedido from "./Pedido";

export default class Factura {
    id?: number;
    fechaFacturacion: Date = new Date();
    mpPaymentId?: number;
    mpMerchantOrderId?: number;
    mpPreferenceId?: string;
    mpPaymentType?: string;
    totalVenta: number = 0;
    pedido!: Pedido;
    eliminado!: boolean;
}