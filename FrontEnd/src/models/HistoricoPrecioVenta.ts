export default class HistoricoPrecioVenta {
    id?: number;
    precio: number = 0;
    fecha: Date = new Date();
    eliminado!: boolean;
}