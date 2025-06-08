import { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import PedidoService from '../../services/PedidoService';
import type Pedido from '../../models/Pedido';

export function GrillaPedidos() {
    // Estados
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showEstadoModal, setShowEstadoModal] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados disponibles
    const estados = ['PENDIENTE', 'PROCESANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];

    // Cargar pedidos
    const cargarPedidos = async () => {
        setLoading(true);
        try {
            const data = await PedidoService.getPedidosFiltrados(
                0, // clienteId 0 para traer todos
                filtroEstado || undefined,
                filtroFechaDesde || undefined,
                filtroFechaHasta || undefined
            );
            // Filtrar por texto si existe
            const pedidosFiltrados = filtroTexto
                ? data.filter(pedido =>
                    `${pedido.cliente.nombre} ${pedido.cliente.apellido}`
                        .toLowerCase()
                        .includes(filtroTexto.toLowerCase())
                )
                : data;
            setPedidos(pedidosFiltrados);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            alert('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, [filtroEstado, filtroFechaDesde, filtroFechaHasta, filtroTexto]);

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFiltroTexto('');
        setFiltroEstado('');
        setFiltroFechaDesde('');
        setFiltroFechaHasta('');
    };

    // Cambiar estado
    const confirmarCambioEstado = async () => {
        if (!pedidoSeleccionado || !nuevoEstado) return;

        try {
            await PedidoService.cambiarEstado(
                pedidoSeleccionado.id!,
                nuevoEstado as any,
                1, // usuarioId del admin
                'ADMIN' // rol
            );
            setShowEstadoModal(false);
            cargarPedidos();
            alert('Estado actualizado correctamente');
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            alert('Error al cambiar el estado del pedido');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Pedidos</h2>

            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por cliente..."
                        value={filtroTexto}
                        onChange={e => setFiltroTexto(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <Form.Select
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        {estados.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </Form.Select>
                </div>
                <div className="col-md-2">
                    <Form.Control
                        type="date"
                        value={filtroFechaDesde}
                        onChange={e => setFiltroFechaDesde(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <Form.Control
                        type="date"
                        value={filtroFechaHasta}
                        onChange={e => setFiltroFechaHasta(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <Button variant="secondary" onClick={limpiarFiltros}>
                        Limpiar Filtros
                    </Button>
                </div>
            </div>

            {/* Tabla de Pedidos */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="text-center">Cargando...</td>
                        </tr>
                    ) : pedidos.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center">No hay pedidos para mostrar</td>
                        </tr>
                    ) : (
                        pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>
                                    {pedido.cliente ?
                                        `${pedido.cliente.nombre || ''} ${pedido.cliente.apellido || ''}` :
                                        'Cliente no disponible'
                                    }
                                </td>
                                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                                <td>{pedido.estado}</td>
                                <td>

                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                            setPedidoSeleccionado(pedido);
                                            setShowDetalleModal(true);
                                        }}
                                    >
                                        Ver Detalle
                                    </Button>
                                    <Form.Select
                                        size="sm"
                                        style={{ width: 'auto', display: 'inline-block' }}
                                        onChange={e => {
                                            setPedidoSeleccionado(pedido);
                                            setNuevoEstado(e.target.value);
                                            setShowEstadoModal(true);
                                        }}
                                        value={pedido.estado}
                                    >
                                        {estados.map(estado => (
                                            <option key={estado} value={estado}>
                                                {estado}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Modal de Detalle */}
            <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pedidoSeleccionado && (
                        <>
                            <h5>Información del Cliente</h5>
                            {pedidoSeleccionado.cliente ? (
                                <>
                                    <p>Nombre: {`${pedidoSeleccionado.cliente.nombre || ''} ${pedidoSeleccionado.cliente.apellido || ''}`}</p>
                                    {pedidoSeleccionado.domicilio && (
                                        <p>Domicilio de entrega: {`${pedidoSeleccionado.domicilio.calle || ''} ${pedidoSeleccionado.domicilio.numero || ''}`}</p>
                                    )}
                                </>
                            ) : (
                                <p>Información del cliente no disponible</p>
                            )}

                            <h5>Productos</h5>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidoSeleccionado.detalles.map(detalle => (
                                        <tr key={detalle.id}>
                                            <td>{detalle.producto?.nombre || 'Producto no disponible'}</td>
                                            <td>{detalle.cantidad}</td>
                                            <td>${detalle.precio}</td>
                                            <td>${detalle.cantidad * detalle.precio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <h5>Total: ${pedidoSeleccionado.detalles.reduce((acc, det) => acc + (det.cantidad * det.precio), 0)}</h5>
                        </>
                    )}
                </Modal.Body>

            </Modal>

            {/* Modal de Confirmación de Cambio de Estado */}
            <Modal show={showEstadoModal} onHide={() => setShowEstadoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar cambio de estado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea cambiar el estado del pedido a {nuevoEstado}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEstadoModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={confirmarCambioEstado}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}