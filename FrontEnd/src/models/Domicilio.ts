import Localidad from "./Localidad";

export default class Domicilio {
    id?: number = 0;
    calle: string = "";
    numero: number = 0;
    codigoPostal: string = "";
    localidad?: Localidad;
    referencia?: string;
    eliminado!: boolean;
}