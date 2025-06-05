import Talle from "../models/Talle";

const API_URL = "http://localhost:8080/api/talle";

class TallesService {
    async getAll(): Promise<Talle[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new TallesService();
