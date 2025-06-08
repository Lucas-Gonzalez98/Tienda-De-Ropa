import Pedido from "../models/Pedido";

const API_URL = "http://localhost:8080/api/pedido";

class PedidoService {
    async getAll(): Promise<Pedido[]> {
        try {
            const res = await fetch(`${API_URL}`);
            if (!res.ok) throw new Error("Error al obtener los pedido");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(pedido: Pedido): Promise<Pedido> {
        try {
            const res = await fetch(`${API_URL}/realizar/${pedido.cliente.id}/2`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });
            console.log(JSON.stringify(pedido));
            if (!res.ok) throw new Error("Error al crear el pedido");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getByCliente(clienteId: number): Promise<Pedido[]> {
        const res = await fetch(`${API_URL}/cliente/${clienteId}`);
        if (!res.ok) throw new Error("Error al obtener pedidos del cliente");
        return await res.json();
    }

    async getPedidosFiltrados(clienteId: number, estado?: string, fechaDesde?: string, fechaHasta?: string): Promise<Pedido[]> {
        const params = new URLSearchParams();
        if (clienteId) params.append('clienteId', clienteId.toString());
        if (estado) params.append('estado', estado);
        if (fechaDesde) params.append('fechaDesde', fechaDesde);
        if (fechaHasta) params.append('fechaHasta', fechaHasta);

        const res = await fetch(`${API_URL}/filtro?${params.toString()}`);
        if (!res.ok) throw new Error("Error al filtrar pedidos");
        return await res.json();
    }

    async getById(pedidoId: number): Promise<Pedido> {
        const res = await fetch(`${API_URL}/${pedidoId}`);
        if (!res.ok) throw new Error("Error al obtener pedido");
        return await res.json();
    }

    async downloadFactura(pedidoId: number): Promise<Blob> {
        const res = await fetch(`${API_URL}/${pedidoId}/factura`, { method: "GET" });
        if (!res.ok) throw new Error("No se pudo descargar la factura.");
        return await res.blob(); // PDF
    }

    async cancelarPedido(pedidoId: number, usuarioId: number): Promise<void> {
        const res = await fetch(`${API_URL}/${pedidoId}/cancelar?usuarioId=${usuarioId}`, {
            method: "PUT"
        });
        if (!res.ok) throw new Error("Error al cancelar el pedido.");
    }

    async cambiarEstado(
        pedidoId: number,
        nuevoEstado: string,
        usuarioId: number,
        rol: string
    ): Promise<void> {
        const res = await fetch(
            `${API_URL}/${pedidoId}/cambiar-estado?nuevoEstado=${nuevoEstado}&usuarioId=${usuarioId}&rol=${rol}`,
            { method: 'PUT' }
        );
        if (!res.ok) throw new Error('Error al cambiar el estado del pedido');
    }



}

export default new PedidoService();