import { Modal, Table, Badge, Button } from "react-bootstrap";
import Pedido from "../../models/Pedido";

interface DetalleProps {
    pedido: Pedido | null;
    show: boolean;
    onClose: () => void;
}

export const PedidoDetalleModal: React.FC<DetalleProps> = ({ pedido, show, onClose }) => {
    if (!pedido) return null;

    // Calcular total
    const total = pedido.detalles.reduce((sum, det) => sum + det.cantidad * det.precio, 0);

    const formatCurrency = (value: number) =>
        value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>🧾 Detalles del Pedido #{pedido.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <div><strong>📅 Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</div>
                    <div><strong>📍 Dirección:</strong> {`${pedido.domicilio?.calle ?? ''} ${pedido.domicilio?.numero ?? ''}` || "No informada"}</div>
                    <div><strong>📦 Estado:</strong> <Badge bg="primary">{pedido.estado}</Badge></div>
                </div>
                <hr />
                <h5 className="mb-3">🛒 Productos del Pedido</h5>
                <Table striped bordered hover size="sm" className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Producto</th>
                            <th>Talle</th>
                            <th>Color</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedido.detalles.map((det) => (
                            <tr key={det.id}>
                                <td>{det.stock?.producto?.nombre}</td>
                                <td>{det.stock?.talle?.nombre}</td>
                                <td>{det.stock?.color?.nombre}</td>
                                <td>{det.cantidad}</td>
                                <td>{formatCurrency(det.precio)}</td>
                                <td>{formatCurrency(det.cantidad * det.precio)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="text-end mt-3">
                    <h5>Total del Pedido: <strong>{formatCurrency(total)}</strong></h5>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
