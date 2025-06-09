// src/components/GrillaPedidos.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Row, Col, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import PedidoService from "../../services/PedidoService";
import Pedido from "../../models/Pedido";
import { PedidoDetalleModal } from "../cliente/PedidoDetalleModal";
import { type Estado } from "../../models/enums/Estado";

const estados: Estado[] = ["PENDIENTE", "PROCESANDO", "EN_CAMINO", "ENTREGADO", "CANCELADO"];

const GrillaPedidos: React.FC = () => {
    const { usuario } = useAuth();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [filtroTexto, setFiltroTexto] = useState<string>("");
    const [filtroEstado, setFiltroEstado] = useState<string>("");
    const [fechaDesde, setFechaDesde] = useState<string>("");
    const [fechaHasta, setFechaHasta] = useState<string>("");

    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

    const [nuevoEstadoMap, setNuevoEstadoMap] = useState<Record<number, Estado>>({});

    const cargarPedidos = async () => {
        setLoading(true);
        try {
            const pedidosFiltrados = await PedidoService.getPedidosFiltrados(
                0,
                filtroEstado || undefined,
                fechaDesde || undefined,
                fechaHasta || undefined
            );

            const filtradosPorTexto = pedidosFiltrados.filter(p =>
                (`${p.cliente.nombre} ${p.cliente.apellido}`)
                    .toLowerCase()
                    .includes(filtroTexto.toLowerCase())
            );

            setPedidos(filtradosPorTexto);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, [filtroTexto, filtroEstado, fechaDesde, fechaHasta]);

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
            await cargarPedidos();
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
                            <option value="">Estado</option>
                            {estados.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button variant="secondary" onClick={limpiarFiltros}>
                            Ver Todos
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
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
                            <td colSpan={6} className="text-center">
                                <Spinner animation="border" /> Cargando...
                            </td>
                        </tr>
                    ) : pedidos.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                No se encontraron pedidos.
                            </td>
                        </tr>
                    ) : (
                        pedidos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.cliente.nombre} {pedido.cliente.apellido}</td>
                                <td>
                                    {pedido.domicilio.calle} {pedido.domicilio.numero},{" "}
                                    {pedido.domicilio.localidad?.nombre}
                                    {pedido.domicilio.referencia ? ` (${pedido.domicilio.referencia})` : ""}
                                </td>
                                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                                <td>{pedido.estado}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleVerDetalle(pedido.id!)}>
                                        Ver
                                    </Button>{" "}
                                    <Button variant="success" size="sm" onClick={() => handleDescargarFactura(pedido.id!)}>
                                        Factura
                                    </Button>{" "}
                                    <Form.Select
                                        size="sm"
                                        value={nuevoEstadoMap[pedido.id!] || pedido.estado}
                                        onChange={(e) =>
                                            setNuevoEstadoMap({ ...nuevoEstadoMap, [pedido.id!]: e.target.value as Estado })
                                        }
                                        className="d-inline w-auto"
                                    >
                                        {estados.map((estado) => (
                                            <option key={estado} value={estado}>
                                                {estado}
                                            </option>
                                        ))}
                                    </Form.Select>{" "}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleCambiarEstado(pedido.id!)}
                                    >
                                        Guardar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pedidoSeleccionado && (
                        <PedidoDetalleModal
                            pedido={pedidoSeleccionado}
                            show={mostrarModal}
                            onClose={() => setMostrarModal(false)}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GrillaPedidos;
