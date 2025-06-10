import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import PedidoService from '../../services/PedidoService';
import Pedido from '../../models/Pedido';
import PedidoCard from './PedidoCard';
import { PedidoDetalleModal } from './PedidoDetalleModal';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Perfil.css';

const estados = ["PENDIENTE", "PROCESANDO", "EN_CAMINO", "ENTREGADO", "CANCELADO"];

const PedidosCliente = () => {
    const { userData } = useAuth();
    const cliente = userData as any;
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidosOriginales, setPedidosOriginales] = useState<Pedido[]>([]);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [detallePedido, setDetallePedido] = useState<Pedido | null>(null);
    const [modalShow, setModalShow] = useState(false);

    const cargarPedidosIniciales = async () => {
        if (!cliente?.id) return;
        const todosLosPedidos = await PedidoService.getPedidosFiltrados(cliente.id);
        setPedidosOriginales(todosLosPedidos);
    };

    const aplicarFiltros = () => {
        let pedidosFiltrados = [...pedidosOriginales];

        // Filtro por estado
        if (estadoFiltro) {
            pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === estadoFiltro);
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        aplicarFiltros();
        // eslint-disable-next-line
    }, [estadoFiltro, fechaDesde, fechaHasta, pedidosOriginales]);

    const handleVerDetalle = async (pedidoId: number) => {
        const pedido = await PedidoService.getById(pedidoId);
        setDetallePedido(pedido);
        setModalShow(true);
    };

    const handleCancelar = async (pedidoId: number) => {
        if (window.confirm("¿Seguro desea cancelar el pedido? Esta acción es irreversible.")) {
            await PedidoService.cancelarPedido(pedidoId, cliente.usuario.id);
            await cargarPedidosIniciales();
        }
    };

    const limpiarFiltros = () => {
        setEstadoFiltro('');
        setFechaDesde('');
        setFechaHasta('');
    };

    return (
        <Container className="my-4">
            <h1 className="perfilTitle d-flex align-items-center flex-column m-3 p-4">Mis Pedidos</h1>

            <Row className="align-items-end mb-3 gap-lg-1 ">
                <Col md="auto">
                    <Button onClick={limpiarFiltros} variant="outline-secondary">
                        <i className="fas fa-eraser me-1"></i>
                        Ver Todos
                    </Button>
                </Col>
                <Col md="auto">
                    <Form.Select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
                        <option value="">Filtrar por Estado</option>
                        {estados.map(e => (
                            <option key={e} value={e}>{e.replace("_", " ")}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md="auto" className="d-flex align-items-center gap-2">
                    <div>Desde:</div>
                    <Form.Control type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
                </Col>
                <Col md="auto" className="d-flex align-items-center gap-2">
                    <div>Hasta:</div>
                    <Form.Control type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
                </Col>
            </Row>
            
            {pedidos.map(p => (
                <PedidoCard
                    key={p.id}
                    pedido={p}
                    onVerDetalle={handleVerDetalle}
                    onCancelar={handleCancelar}
                />
            ))}

            <PedidoDetalleModal
                pedido={detallePedido}
                show={modalShow}
                onClose={() => setModalShow(false)}
            />
        </Container>
    );
};

export default PedidosCliente;