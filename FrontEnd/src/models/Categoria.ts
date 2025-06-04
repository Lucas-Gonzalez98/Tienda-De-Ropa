export default class Categoria {
    id?: number;
    denominacion: string = "";
    subcategorias: Categoria[] = [];
    categoriaPadre?: Categoria;
    eliminado!: boolean;
}