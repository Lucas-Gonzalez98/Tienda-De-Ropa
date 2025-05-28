import Pais from "./Pais";

export default class Provincia {
    id?: number;
    nombre: string = "";
    pais!: Pais;
    eliminado!: boolean;
}