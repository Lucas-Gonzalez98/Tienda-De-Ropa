import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import Pedido from '../../models/Pedido';

interface PedidoCardProps {
    pedido: Pedido;
}

const estadoColors: Record<string, string> = {
    PENDIENTE: 'secondary',
    PROCESANDO: 'warning',
    EN_CAMINO: 'success',
    ENTREGADO: 'primary',
    CANCELADO: 'danger',
};

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido }) => {
    const estadoColor = estadoColors[pedido.estado.replace(" ", "_")] || 'secondary';

    return (
        <Card className="mb-1 shadow-sm" style={{ fontSize: '0.9rem' }}>
            <Card.Body className="py-1 px-2">
                <Row>
                    <Col md={9}>
                        <Card.Title className="mb-1">Pedido #{pedido.id}</Card.Title>
                        <Card.Text className="mb-1">Fecha Pedido: {new Date(pedido.fecha).toLocaleDateString()}</Card.Text>
                        <Card.Text className="mb-1">Dirección: (Aquí iría la dirección)</Card.Text>
                        <Card.Text className="mb-1">Total Pedido: $$$</Card.Text>
                    </Col>
                    <Col md={3} className="text-end">
                        <Badge bg={estadoColor} className="mb-2">{pedido.estado.replace("_", " ")}</Badge>
                        <br />
                        <Button variant="outline-dark" size="sm">Ver Detalle</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PedidoCard;
