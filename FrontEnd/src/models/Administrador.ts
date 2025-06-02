import Usuario from "./Usuario.ts";
import Telefono from "./Telefono.ts";
import Domicilio from "./Domicilio.ts";

export default class Administrador {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: Telefono = new Telefono();
    domicilio: Domicilio = new Domicilio();
    usuario: Usuario = new Usuario();
    eliminado: boolean = false;
}
