import Domicilio from "../models/Domicilio";

const API_URL = "http://localhost:8080/api/domicilio";

class DomicilioService {
    async getAll(): Promise<Domicilio[]> {
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

export default new DomicilioService();
