import type ImagenProducto from "./ImagenProducto";

export default class Pedido {
    id?: number;
    nombre: string = "";
    descripcion: string = "";
    precio: number = 0;
    imagenes!: ImagenProducto[];
    eliminado!: boolean;
}