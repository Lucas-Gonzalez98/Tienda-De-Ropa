
import Domicilio from "./Domicilio";
import Pedido from "./Pedido";
import Usuario from "./Usuario.ts";

export default class Cliente {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    fechaNacimiento: Date = new Date();
    usuario: Usuario = new Usuario() ;
    domicilios: Domicilio[] = [];
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}