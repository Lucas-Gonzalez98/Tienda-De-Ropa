import Sucursal from "./Sucursal";

export default class Empresa {
    id?: number;
    nombre: string = "";
    razonSocial: string = "";
    cuil: number = 0;
    sucursales: Sucursal[] = [];
    eliminado!: boolean;
}