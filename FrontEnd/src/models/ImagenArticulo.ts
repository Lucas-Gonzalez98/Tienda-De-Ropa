import Articulo from "./Articulo";

export default class ImagenArticulo {
    id?: number;
    denominacion: string = "";
    articulo!: Articulo;
    eliminado!: boolean;
}