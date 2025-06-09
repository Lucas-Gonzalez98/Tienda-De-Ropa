import type {Rol} from "./enums/Rol.ts";

export default class Usuario {
    id?: number;
    email: string = "";
    firebaseUid: string = "";
    rol: Rol = "CLIENTE";
    eliminado: boolean = false;
    token?: string;
}
