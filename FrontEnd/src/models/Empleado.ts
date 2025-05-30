import ImagenEmpleado from "./ImagenEmpleado";
import UsuarioEmpleado from "./UsuarioEmpleado";
import Domicilio from "./Domicilio";
import Pedido from "./Pedido";
import type { Rol } from "./enums/Rol";

export default class Empleado {
    id?: number;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    fechaNacimiento: Date = new Date();
    dni: number = 0;
    rolEmpleado!: Rol;
    imagenEmpleado!: ImagenEmpleado;
    usuarioEmpleado!: UsuarioEmpleado;
    domicilio?: Domicilio;
    pedidos: Pedido[] = [];
    eliminado!: boolean;
}