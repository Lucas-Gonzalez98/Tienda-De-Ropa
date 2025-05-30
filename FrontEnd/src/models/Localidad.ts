import Provincia from "./Provincia";

export default class Localidad {
    id?: number;
    nombre: string = "";
    provincia!: Provincia;
    eliminado!: boolean;
}