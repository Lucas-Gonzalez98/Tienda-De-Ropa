import type Stock from "../models/Stock";

const API_URL = "http://localhost:8080/api/stock";

class PedidoService {
    async getAll(): Promise<Stock[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener los stocks");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(stock: Stock): Promise<any> {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stock),
            });
            if (!res.ok) throw new Error("Error al crear el Stock");
            return await res.json();  
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async consultarStock(productoId: number, talleId: number, colorId: number): Promise<number> {
        try {
            const queryParams = new URLSearchParams({
            productoId: productoId.toString(),
            talleId: talleId.toString(),
            colorId: colorId.toString(),
            });

            const res = await fetch(`${API_URL}/producto-disponible?${queryParams.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Error al consultar el stock");

            const cantidadDisponible = await res.json();
            return cantidadDisponible; // es un número, no un Pedido
        } catch (error) {
            console.error("Error en consultarStock:", error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Error al eliminar la Stock");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async changeEliminado(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/restore/${id}`, {
                method: "PUT"
            });
            if (!res.ok) throw new Error("Error al dar de alta la Stock");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new PedidoService();