import Color from "../models/Color";

const API_URL = "http://localhost:8080/api/color";

class ColorsService {
    async getAll(): Promise<Color[]> {
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

export default new ColorsService();
