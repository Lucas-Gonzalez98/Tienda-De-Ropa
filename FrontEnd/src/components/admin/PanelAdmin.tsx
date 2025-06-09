import { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import '../../styles/PanelAdmin.css';
import AdminPanelIcon from '../../assets/admin_panel.svg'; // Importa el SVG
import GrillaProductos from '../articulos/GrillaProducts';
import GrillaCategorias from '../articulos/GrillaCategoria';
import GrillaCliente from "./GrillaCliente.tsx";
import { GrillaStock } from '../articulos/GrillaStock.tsx';
import GrillaPedidos from '../articulos/GrillaPedidos.tsx';

function PanelAdmin() {
    const [selected, setSelected] = useState('Productos');

    const renderContent = () => {
        switch (selected) {
            case 'Productos':
                return <div><GrillaProductos/></div>;
            case 'Categorias':
                return <div><GrillaCategorias/></div>;
            case 'Pedidos':
                return <GrillaPedidos />;
            case 'Clientes':
                return <GrillaCliente/>;
            case 'Stock':
                return <GrillaStock/>;
            default:
                return <div>Bienvenido al panel</div>;
        }
    };

    return (
        <Container fluid className="panel-admin-container w-full">
            <Row>
                <Col md={2} className="sidebar bg-dark text-white p-3">
                    <div className="d-flex align-items-center mb-4">
                        <div className="d-flex flex-column w-100">
                            <div className="d-flex align-items-center mb-1">
                                <img
                                    src={AdminPanelIcon}
                                    alt="Admin Panel Icon"
                                    style={{ width: '48px', height: '48px', marginRight: '12px' }}
                                />
                                <h6 className="mb-0">Panel de Administración</h6>
                            </div>
                        </div>
                    </div>
                    <Nav className="flex-column">
                        {['Productos', 'Categorias', 'Pedidos', 'Clientes','Stock'].map((item) => (
                            <Nav.Link
                                key={item}
                                onClick={() => setSelected(item)}
                                className={`text-white mb-2 ${selected === item ? 'fw-bold active' : ''}`}
                            >
                                {item}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Col>
                <Col md={{ span: 10, offset: 2 }} className="p-4 content-wrapper">
                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
}

export default PanelAdmin;