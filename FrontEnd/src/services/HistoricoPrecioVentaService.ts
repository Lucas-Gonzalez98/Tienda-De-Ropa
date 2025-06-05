import HistoricoPrecioVenta from "../models/HistoricoPrecioVenta";
import type Producto from "../models/Producto";

const API_URL = "http://localhost:8080/api/historico-precio-ventas";

class HistoricoPrecioVentaService {
    async getAll(): Promise<HistoricoPrecioVenta[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async ultimoById(producto: Producto): Promise<HistoricoPrecioVenta> {
        try {
            const res = await fetch(`${API_URL}/ultimo/${producto.id}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new HistoricoPrecioVentaService();
