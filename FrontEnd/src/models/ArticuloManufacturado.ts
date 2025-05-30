import Articulo from "./Articulo";
import DetalleArticuloManufacturado from "./DetalleArticuloManufacturado";
import ImagenArticuloManufacturado from "./ImagenArticuloManufacturado";

export default class ArticuloManufacturado extends Articulo {
    descripcion: string = "";
    tiempoEstimadoMinutos: number = 0;
    preparacion: string = "";
    detalles: DetalleArticuloManufacturado[] = [];
    imagenes: ImagenArticuloManufacturado[] = [];
}