export default class Categoria {
    id?: number;
    denominacion: string = "";
    categoriaPadre?: Categoria;
    subcategorias: Categoria[] = [];
    eliminado!: boolean;
}