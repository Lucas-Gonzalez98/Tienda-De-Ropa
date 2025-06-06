import Pedido from "../models/Pedido";

const API_URL = "http://localhost:8080/api/pedido";

class PedidoService {
    async getAll(): Promise<Pedido[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener los pedido");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async create(pedido: Pedido): Promise<Pedido> {
        try {
            const res = await fetch(`${API_URL}/realizar/${pedido.cliente.id}/${pedido.cliente.domicilios[0].id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });
            console.log(JSON.stringify(pedido));
            if (!res.ok) throw new Error("Error al crear el pedido");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new PedidoService();