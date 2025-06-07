import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import PedidoService from '../../services/PedidoService';
import Pedido from '../../models/Pedido';
import PedidoCard from './PedidoCard';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Perfil.css';

const estados = ["PENDIENTE", "PROCESANDO", "EN_CAMINO", "ENTREGADO", "CANCELADO"];

const PedidosCliente = () => {
    const { userData } = useAuth();
    const cliente = userData as any;
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const cargarPedidos = async () => {
        if (!cliente?.id) return;
        const pedidos = await PedidoService.getPedidosFiltrados(cliente.id, estadoFiltro, fechaDesde, fechaHasta);
        setPedidos(pedidos);
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    return (
        <Container className="my-4">
            <h1 className="perfilTitle d-flex align-items-center flex-column m-3 p-4">Mis Pedidos</h1>

            <Row className="align-items-end mb-3 gap-lg-1 ">
                <Col md="auto">
                    <Button onClick={cargarPedidos} variant="dark">Ver Todos</Button>
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
                <Col md="auto">
                    <Button variant="primary" onClick={cargarPedidos}>Filtrar</Button>
                </Col>
            </Row>

            {pedidos.map(p => <PedidoCard key={p.id} pedido={p} />)}
        </Container>

    );
};

export default PedidosCliente;
