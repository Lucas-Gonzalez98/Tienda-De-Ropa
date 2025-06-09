import type Stock from "../models/Stock";

const API_URL = "http://localhost:8080/api/stock";

class StockService {
    async getAll(): Promise<Stock[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener los stocks");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getByProducto(productoId: number): Promise<Stock[]> {
        try {
            const res = await fetch(`${API_URL}/producto/${productoId}`);
            if (!res.ok) throw new Error("Error al obtener el stock del producto");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(stock: Stock): Promise<any> {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stock),
            });
            if (!res.ok) throw new Error("Error al crear el Stock");
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

    async delete(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Error al eliminar la Stock");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async changeEliminado(id: number): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/restore/${id}`, {
                method: "PUT"
            });
            if (!res.ok) throw new Error("Error al dar de alta la Stock");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getById(id: number): Promise<Stock> {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "GET"
            });
            if (!res.ok) throw new Error("Error al dar de alta la Stock");
            return await res.json()
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async crearOActualizarStock(datos: {
    idProducto: number,
    idColor: number,
    idTalle: number,
    cantidad: number,
    precioCompra: number
    }): Promise<Stock> {
        try {
            // Primero verificamos si existe el stock
            const stockExistente = await this.consultarStock(
                datos.idProducto,
                datos.idTalle,
                datos.idColor
            );

            if (stockExistente > 0) {
                // Si existe, usamos PUT para actualizar
                const response = await fetch(`${API_URL}/actualizar`, {
                    method: 'PUT', // Cambiado de POST a PUT
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        idProducto: datos.idProducto.toString(),
                        idColor: datos.idColor.toString(),
                        idTalle: datos.idTalle.toString(),
                        cantidadAdicional: datos.cantidad.toString(), // Cambiado a cantidadAdicional
                        nuevoPrecioCompra: datos.precioCompra.toString() // Cambiado a nuevoPrecioCompra
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el stock');
                }

                return await response.json();
            } else {
                // Si no existe, creamos nuevo
                const response = await fetch(`${API_URL}/crear`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        idProducto: datos.idProducto.toString(),
                        idColor: datos.idColor.toString(),
                        idTalle: datos.idTalle.toString(),
                        cantidad: datos.cantidad.toString(),
                        precioCompra: datos.precioCompra.toString()
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al crear el stock');
                }

                return await response.json();
            }
        } catch (error) {
            console.error('Error en crearOActualizarStock:', error);
            throw error;
        }
    }

}

export default new StockService();