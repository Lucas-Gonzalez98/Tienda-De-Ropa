import Cliente from "../models/Cliente";

const API_URL = "http://localhost:8080/api/cliente";

const ClienteService = {
    getAll: async (): Promise<Cliente[]> => {
        const response = await fetch(`${API_URL}/all`);
        if (!response.ok) throw new Error("Error al obtener los clientes");
        return await response.json();
    },

    async getClienteById(id: number): Promise<Cliente> {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Error al obtener productos");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    
    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el cliente");
    },

    restore: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/restore/${id}`, {
            method: "PUT",
        });
        if (!response.ok) throw new Error("Error al restaurar el cliente");
    },
};

export default ClienteService;
