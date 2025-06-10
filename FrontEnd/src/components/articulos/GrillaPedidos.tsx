// src/components/GrillaPedidos.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Spinner, Badge } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import PedidoService from "../../services/PedidoService";
import Pedido from "../../models/Pedido";
import { PedidoDetalleModal } from "../cliente/PedidoDetalleModal";
import { type Estado } from "../../models/enums/Estado";

const estados: Estado[] = ["PENDIENTE", "PROCESANDO", "EN_CAMINO", "ENTREGADO", "CANCELADO"];

const estadoColors: Record<string, string> = {
    PENDIENTE: 'secondary',
    PROCESANDO: 'warning',
    EN_CAMINO: 'info',
    ENTREGADO: 'success',
    CANCELADO: 'danger',
};

const GrillaPedidos: React.FC = () => {
    const { usuario } = useAuth();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidosOriginales, setPedidosOriginales] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [filtroTexto, setFiltroTexto] = useState<string>("");
    const [filtroEstado, setFiltroEstado] = useState<string>("");
    const [fechaDesde, setFechaDesde] = useState<string>("");
    const [fechaHasta, setFechaHasta] = useState<string>("");

    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

    const [nuevoEstadoMap, setNuevoEstadoMap] = useState<Record<number, Estado>>({});

    const cargarPedidosIniciales = async () => {
        setLoading(true);
        try {
            const todosLosPedidos = await PedidoService.getPedidosFiltrados(0);
            setPedidosOriginales(todosLosPedidos);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let pedidosFiltrados = [...pedidosOriginales];

        // Filtro por texto (nombre del cliente)
        if (filtroTexto) {
            pedidosFiltrados = pedidosFiltrados.filter(p =>
                (`${p.cliente.nombre} ${p.cliente.apellido}`)
                    .toLowerCase()
                    .includes(filtroTexto.toLowerCase())
            );
        }

        // Filtro por estado
        if (filtroEstado) {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filtroEstado);
        }

        // Filtro por fecha desde
        if (fechaDesde) {
            pedidosFiltrados = pedidosFiltrados.filter(p => 
                new Date(p.fecha) >= new Date(fechaDesde)
            );
        }

        // Filtro por fecha hasta
        if (fechaHasta) {
            pedidosFiltrados = pedidosFiltrados.filter(p => 
                new Date(p.fecha) <= new Date(fechaHasta)
            );
        }

        // Ordenar por fecha (más recientes primero)
        pedidosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        setPedidos(pedidosFiltrados);
    };

    useEffect(() => {
        cargarPedidosIniciales();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [filtroTexto, filtroEstado, fechaDesde, fechaHasta, pedidosOriginales]);

    const handleVerDetalle = async (pedidoId: number) => {
        try {
            const pedido = await PedidoService.getById(pedidoId);
            setPedidoSeleccionado(pedido);
            setMostrarModal(true);
        } catch (error) {
            console.error("Error al obtener detalles del pedido:", error);
        }
    };

    const handleDescargarFactura = async (pedidoId: number) => {
        try {
            const blob = await PedidoService.downloadFactura(pedidoId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factura_${pedidoId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar la factura:", error);
        }
    };

    const handleCambiarEstado = async (pedidoId: number) => {
        if (!usuario || usuario.id === undefined) {
            alert("No se encontró información del usuario.");
            return;
        }

        const nuevoEstado = nuevoEstadoMap[pedidoId];
        if (!nuevoEstado) {
            alert("Seleccione un estado válido.");
            return;
        }

        try {
            setLoading(true);
            await PedidoService.cambiarEstadoPedido(
                pedidoId,
                nuevoEstado.toUpperCase(),
                usuario.id,
                usuario.rol.toUpperCase()
            );
            alert("Estado actualizado correctamente.");
            await cargarPedidosIniciales();
        } catch (error: any) {
            alert("Error al cambiar el estado: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroTexto("");
        setFiltroEstado("");
        setFechaDesde("");
        setFechaHasta("");
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Pedidos</h2>
            <Form className="mb-3">
                <Row>
                    <Col md={3}>
                        <Form.Control
                            placeholder="Buscar por cliente"
                            value={filtroTexto}
                            onChange={(e) => setFiltroTexto(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            {estados.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado.replace('_', ' ')}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            placeholder="Fecha desde"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            placeholder="Fecha hasta"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-secondary" onClick={limpiarFiltros}>
                            <i className="fas fa-eraser me-1"></i>
                            Limpiar Filtros
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>N° Pedido</th>
                        <th>Cliente</th>
                        <th>Domicilio</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-4">
                                <Spinner animation="border" variant="primary" /> 
                                <div className="mt-2">Cargando pedidos...</div>
                            </td>
                        </tr>
                    ) : pedidos.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                                <i className="fas fa-search fa-2x mb-2"></i>
                                <div>No se encontraron pedidos con los filtros aplicados.</div>
                            </td>
                        </tr>
                    ) : (
                        pedidos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td className="fw-bold"># {pedido.id}</td>
                                <td>
                                    <div className="fw-semibold">
                                        {pedido.cliente.nombre} {pedido.cliente.apellido}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {pedido.domicilio.calle} {pedido.domicilio.numero}, {pedido.domicilio.localidad?.nombre}
                                    </div>
                                    {pedido.domicilio.referencia && (
                                        <small className="text-muted d-block mt-1">
                                            <i className="fas fa-map-marker-alt me-1"></i>
                                            {pedido.domicilio.referencia}
                                        </small>
                                    )}
                                </td>
                                <td>{new Date(pedido.fecha).toLocaleDateString('es-AR')}</td>
                                <td>
                                    <Badge bg={estadoColors[pedido.estado]} className="px-2 py-1">
                                        {pedido.estado.replace('_', ' ')}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap gap-1">
                                        <Button 
                                            variant="outline-info" 
                                            size="sm" 
                                            onClick={() => handleVerDetalle(pedido.id!)}
                                            className="d-flex align-items-center"
                                        >
                                            <i className="fas fa-eye me-1"></i>
                                            Ver
                                        </Button>
                                        
                                        <Button 
                                            variant="outline-success" 
                                            size="sm" 
                                            onClick={() => handleDescargarFactura(pedido.id!)}
                                            className="d-flex align-items-center"
                                        >
                                            <i className="fas fa-file-pdf me-1"></i>
                                            Factura
                                        </Button>
                                        
                                        <div className="d-flex align-items-center">
                                            <Form.Select
                                                size="sm"
                                                value={nuevoEstadoMap[pedido.id!] || pedido.estado}
                                                onChange={(e) =>
                                                    setNuevoEstadoMap({ 
                                                        ...nuevoEstadoMap, 
                                                        [pedido.id!]: e.target.value as Estado 
                                                    })
                                                }
                                                className="me-1"
                                                style={{ minWidth: '120px' }}
                                            >
                                                {estados.map((estado) => (
                                                    <option key={estado} value={estado}>
                                                        {estado.replace('_', ' ')}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            
                                            <Button
                                                variant={estadoColors[nuevoEstadoMap[pedido.id!] || pedido.estado]}
                                                size="sm"
                                                onClick={() => handleCambiarEstado(pedido.id!)}
                                                disabled={!nuevoEstadoMap[pedido.id!] || nuevoEstadoMap[pedido.id!] === pedido.estado}
                                                className="d-flex align-items-center"
                                            >
                                                <i className="fas fa-save me-1"></i>
                                                Actualizar
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {pedidoSeleccionado && (
                <PedidoDetalleModal
                    pedido={pedidoSeleccionado}
                    show={mostrarModal}
                    onClose={() => setMostrarModal(false)}
                />
            )}
        </div>
    );
};

export default GrillaPedidos;