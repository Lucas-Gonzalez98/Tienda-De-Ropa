import Articulo from "./Articulo";
import SucursalInsumo from "./SucursalInsumo";

export default class ArticuloInsumo extends Articulo {
    precioCompra: number = 0;
    esParaElaborar!: boolean;
    sucursalInsumo!: SucursalInsumo;
}