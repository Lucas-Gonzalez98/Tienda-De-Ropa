import type Stock from "../models/Stock";

const API_URL = "http://localhost:8080/api/stock";

class StockService {
    //SIRVE
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
    //SIRVE
    async getStock(productoId: number, colorId: number, talleId: number): Promise<Stock> {
        try {
            const res = await fetch(`${API_URL}/buscar/stock?idProducto=${productoId}&idColor=${colorId}&idTalle=${talleId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Error al obtener el stock del producto");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // SIRVE
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

    //SIRVE
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

    async getAll(): Promise<Stock[]> {
        const res = await fetch(`${API_URL}`);
        if (!res.ok) throw new Error("Error al obtener todos los stocks");
        return await res.json();
    }

    async getDisponibles(): Promise<Stock[]> {
        const res = await fetch(`${API_URL}/disponibles`);
        if (!res.ok) throw new Error("Error al obtener stocks disponibles");
        return await res.json();
    }

    async crearStock(
        idProducto: number,
        idColor: number,
        idTalle: number,
        cantidad: number,
        precioCompra: number
    ): Promise<Stock | null> {
        const body = new URLSearchParams({
            idProducto: idProducto.toString(),
            idColor: idColor.toString(),
            idTalle: idTalle.toString(),
            cantidad: cantidad.toString(),
            precioCompra: precioCompra.toString()
        });

        try {
            const res = await fetch(`${API_URL}/crear`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (errorText.includes("Ya existe stock")) {
                    // Mostrar modal personalizado si lo tienes, o un alert por ahora
                    alert("Ya está creado el Stock para este Producto con su Talle y Color");
                    return null;
                } else {
                    throw new Error("porque ya existe ese stock");
                }
            }

            return await res.json();

        } catch (error) {
            console.error("Error en crearStock:", error);
            alert("No se puede crear porque ya existe este stock para ese producto, talle y color");
            return null;
        }
    }

    async agregarStock(
        idProducto: number,
        idColor: number,
        idTalle: number,
        cantidadAdicional: number,
        precioCompra: number
    ): Promise<Stock> {
        const body = new URLSearchParams({
            idProducto: idProducto.toString(),
            idColor: idColor.toString(),
            idTalle: idTalle.toString(),
            cantidadAdicional: cantidadAdicional.toString(),
            precioCompra: precioCompra.toString()
        });

        const res = await fetch(`${API_URL}/agregar`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });

        if (!res.ok) throw new Error("Error al agregar stock");
        return await res.json();
    }

    async actualizarStock(
        stockId: number,
        idProducto: number,
        idColor: number,
        idTalle: number,
        nuevaCantidad: number,
        precioCompra: number
    ): Promise<Stock> {
        const body = new URLSearchParams({
            idProducto: idProducto.toString(),
            idColor: idColor.toString(),
            idTalle: idTalle.toString(),
            nuevaCantidad: nuevaCantidad.toString(),
            precioCompra: precioCompra.toString()
        });

        const res = await fetch(`${API_URL}/actualizar/${stockId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });

        if (!res.ok) throw new Error("Error al actualizar el stock");
        return await res.json();
    }

    async getUltimoPrecioCompra(productoId: number): Promise<number> {
        const res = await fetch(`${API_URL}/precio-compra/${productoId}`);
        if (res.status === 404) return 0;
        if (!res.ok) throw new Error("Error al obtener el último precio de compra");
        const data = await res.json();
        return typeof data === 'number' ? data : data?.precio ?? 0;
    }

    async filtrarPorTalleYColor(talleId: number, colorId: number): Promise<Stock[]> {
        const query = new URLSearchParams({
            idTalle: talleId.toString(),
            idColor: colorId.toString()
        });

        const res = await fetch(`${API_URL}/filtrar?${query.toString()}`);
        if (!res.ok) throw new Error("Error al filtrar stock por talle y color");
        return await res.json();
    }

    async eliminarStock(stockId: number): Promise<void> {
        const res = await fetch(`${API_URL}/${stockId}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Error al eliminar el stock");
    }
}


export default new StockService();