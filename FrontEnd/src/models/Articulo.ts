import ImagenArticulo from "./ImagenArticulo";
import UnidadMedida from "./UnidadMedida";
import Categoria from "./Categoria";

export default abstract class Articulo {
    id?: number;
    denominacion: string = "";
    precioVenta: number = 0;
    imagenes: ImagenArticulo[] = [];
    unidadMedida!: UnidadMedida;
    categoria!: Categoria;
    eliminado!: boolean;
}