import Producto from "./Producto";
export default class ImagenProducto {
    id?: number;
    denominacion: string = "";
    producto!: Producto;
    eliminado!: boolean;
}