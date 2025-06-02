
import Domicilio from "./Domicilio";
import Usuario from "./Usuario.ts";
import Telefono from "./Telefono.ts";

export default class Cliente {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: Telefono = new Telefono();
    fechaNacimiento: Date = new Date();
    usuario: Usuario = new Usuario() ;
    domicilios: Domicilio[] = [];
    eliminado!: boolean;
}