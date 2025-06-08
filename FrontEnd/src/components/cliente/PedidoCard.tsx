import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import Pedido from '../../models/Pedido';
import PedidoService from '../../services/PedidoService';

interface PedidoCardProps {
    pedido: Pedido;
    onVerDetalle: (pedidoId: number) => void;
    onCancelar: (pedidoId: number) => void;
}

const estadoColors: Record<string, string> = {
    PENDIENTE: 'secondary',
    PROCESANDO: 'warning',
    EN_CAMINO: 'success',
    ENTREGADO: 'primary',
    CANCELADO: 'danger',
};

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, onVerDetalle, onCancelar }) => {
    const handleDescargarFactura = async () => {
        try {
            const blob = await PedidoService.downloadFactura(pedido.id!);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura_pedido_${pedido.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Error al descargar la factura");
        }
    };

    const estadoColor = estadoColors[pedido.estado.replace(" ", "_")] || 'secondary';

    return (
        <Card className="mb-1 shadow-sm" style={{ fontSize: '0.9rem' }}>
            <Card.Body className="py-1 px-2">
                <Row>
                    <Col md={9}>
                        <Card.Title className="mb-1">Pedido #{pedido.id}</Card.Title>
                        <Card.Text className="mb-1">
                            Fecha Pedido: {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : ""}
                        </Card.Text>
                        <Card.Text className="mb-1">
                            Dirección: {pedido.domicilio ? `${pedido.domicilio.calle} ${pedido.domicilio.numero}` : "--"}
                        </Card.Text>
                        {/* Si tienes el total en el pedido, colócalo aquí, de lo contrario, borra esta línea o muéstralo si lo calculas */}
                        {/* <Card.Text className="mb-1">Total Pedido: ${pedido.total}</Card.Text> */}
                    </Col>
                    <Col md={3} className="text-end">
                        <Badge bg={estadoColor} className="mb-2">{pedido.estado.replace("_", " ")}</Badge>
                        <br />
                        <Button
                            variant="outline-dark"
                            size="sm"
                            className="mb-1"
                            onClick={() => onVerDetalle(pedido.id!)}
                        >
                            Ver Detalle
                        </Button>
                        <br />
                        <Button
                            variant="outline-success"
                            size="sm"
                            className="mb-1"
                            onClick={handleDescargarFactura}
                        >
                            Descargar Factura
                        </Button>
                        <br />
                        {pedido.estado === "PENDIENTE" && (
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => onCancelar(pedido.id!)}
                            >
                                Cancelar Pedido
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PedidoCard;
