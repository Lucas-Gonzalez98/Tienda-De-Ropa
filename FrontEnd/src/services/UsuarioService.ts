import Usuario from "../models/Usuario";

const BASE_URL = "http://localhost:8080/api/usuario";

export const obtenerUsuarioPorEmail = async (email: string): Promise<Usuario | null> => {
    try {
        const response = await fetch(`${BASE_URL}/email/${email}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error al verificar email:", error);
        return null;
    }
};