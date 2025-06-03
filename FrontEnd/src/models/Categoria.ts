export default class Categoria {
    id?: number;
    denominacion: string = "";
    subcategorias: Categoria[] = [];
    eliminado!: boolean;
}