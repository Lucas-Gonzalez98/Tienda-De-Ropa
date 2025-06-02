import Producto from "../models/Producto";

const API_URL = "http://localhost:8080/api/producto";

class ProductoService {
    async getNotDeleted(): Promise<Producto[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener categorías");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAll(): Promise<Producto[]> {
        try {
            const res = await fetch(`${API_URL}/all`);
            if (!res.ok) throw new Error("Error al obtener categorías");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Error al eliminar la Producto");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getById(id: number): Promise<Producto> {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Error al obtener el la Producto");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(articulo: any): Promise<any> {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articulo)
            });
            console.log(JSON.stringify(articulo));
            if (!res.ok) throw new Error("Error al crear la Producto");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async update(id: number, articulo: Producto): Promise<Producto> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articulo)
            });
            console.log(JSON.stringify(articulo))
            if (!res.ok) throw new Error("Error al actualizar la Producto");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async changeEliminado(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/darAlta/${id}`, {
                method: "PUT"
            });
            if (!res.ok) throw new Error("Error al dar de alta la Producto");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new ProductoService();