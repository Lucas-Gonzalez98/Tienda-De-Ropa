import HistoricoPrecioVenta from "../models/HistoricoPrecioVenta";

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

    async getAllProductoId(id: number): Promise<HistoricoPrecioVenta[]> {
        try {
            const res = await fetch(`${API_URL}/producto/${id}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async ultimoById(id: number): Promise<HistoricoPrecioVenta> {
        try {
            const res = await fetch(`${API_URL}/ultimo/${id}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(historico: HistoricoPrecioVenta): Promise<HistoricoPrecioVenta> {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(historico)
            });
            console.log(JSON.stringify(historico));
            if (!res.ok) throw new Error("Error al crear la Categoria");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUltimosById(id: number, limit: number = 3): Promise<HistoricoPrecioVenta[]> {
        try {
            const res = await fetch(`${API_URL}/ultimos/${id}?limit=${limit}`);
            if (!res.ok) throw new Error("Error al obtener los precios de venta históricos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new HistoricoPrecioVentaService();
