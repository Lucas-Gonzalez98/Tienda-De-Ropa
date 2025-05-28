export default class Existencia {
    id?: number;
    fechaCompra: Date = new Date();
    fechaVencimiento?: Date = new Date();
    cantidad: number = 0;
    eliminado!: boolean;
}