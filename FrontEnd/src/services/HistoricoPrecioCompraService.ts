import type HistoricoPrecioCompra from "../models/HistoricoPrecioCompra";

const API_URL = 'http://localhost:8080/api/historico-precio-compra';

class HistoricoPrecioCompraService {
    async getUltimosById(id: number, limit: number = 3): Promise<HistoricoPrecioCompra[]> {
        try {
            const res = await fetch(`${API_URL}/ultimos/${id}?limit=${limit}`);
            if (!res.ok) throw new Error("Error al obtener los precios de compra históricos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new HistoricoPrecioCompraService();
