import { Modal, Table, Badge } from "react-bootstrap";
import Pedido from "../../models/Pedido";

interface DetalleProps {
    pedido: Pedido | null;
    show: boolean;
    onClose: () => void;
}

export const PedidoDetalleModal: React.FC<DetalleProps> = ({ pedido, show, onClose }) => {
    if (!pedido) return null;
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles Pedido #{pedido.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div><b>Fecha:</b> {new Date(pedido.fecha).toLocaleDateString()}</div>
                <div><b>Dirección:</b> {`${pedido.domicilio.calle} ${pedido.domicilio.numero}` || "No informada"}</div>
                <div><b>Estado:</b> <Badge bg="info">{pedido.estado}</Badge></div>
                <hr/>
                <Table size="sm">
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pedido.detalles.map(det => (
                        <tr key={det.id}>
                            <td>{det.producto?.nombre}</td>
                            <td>{det.cantidad}</td>
                            <td>${det.precio}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
};
