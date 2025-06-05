import Pedido from "../models/Pedido";

const API_URL = "http://localhost:8080/api/stock";

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


}

export default new PedidoService();