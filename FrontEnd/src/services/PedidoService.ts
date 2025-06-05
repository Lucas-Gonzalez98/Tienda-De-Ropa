import Pedido from "../models/Pedido";

const API_URL = "http://localhost:8080/api/pedido";

class PedidoService {
    async getAll(): Promise<Pedido[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async create(articulo: Pedido): Promise<Pedido> {
        try {
            const res = await fetch(`${API_URL}/realizar/1/2`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articulo)
            });
            console.log(JSON.stringify(articulo));
            if (!res.ok) throw new Error("Error al crear artículo manufacturado");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new PedidoService();