import { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import '../../styles/PanelAdmin.css';
import AdminPanelIcon from '../../assets/admin_panel.svg'; // Importa el SVG
import GrillaProductos from '../articulos/GrillaProductos.tsx';
import GrillaCategorias from '../articulos/GrillaCategoria';
import GrillaCliente from "./GrillaCliente.tsx";
import { GrillaStock } from '../articulos/GrillaStock.tsx';
import GrillaPedidos from '../articulos/GrillaPedidos.tsx';

function PanelAdmin() {
    const [selected, setSelected] = useState('Principal');

    const modules = ['Productos', 'Categorias', 'Pedidos', 'Clientes', 'Stock'];

    const renderContent = () => {
        switch (selected) {
            case 'Productos':
                return <GrillaProductos />;
            case 'Categorias':
                return <GrillaCategorias />;
            case 'Pedidos':
                return <GrillaPedidos />;
            case 'Clientes':
                return <GrillaCliente />;
            case 'Stock':
                return <GrillaStock />;
            case 'Principal':
            default:
                return (
                    <Container>
                        <h4 className="mb-4">Bienvenido al Panel de Administración</h4>
                        <Row>
                            {modules.map((modulo, index) => (
                                <Col md={6} className="mb-3" key={index}>
                                    <Button
                                        variant="outline-primary"
                                        className="w-100 py-3 fs-5"
                                        onClick={() => setSelected(modulo)}
                                    >
                                        {modulo}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                );
        }
    };

    return (
        <Container fluid className="panel-admin-container w-full">
            <Row>
                <Col md={2} className="sidebar bg-dark text-white p-3 min-vh-100">
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
                        <Nav.Link
                            onClick={() => setSelected('Principal')}
                            className={`text-white mb-2 ${selected === 'Principal' ? 'fw-bold active' : ''}`}
                        >
                            Página Principal
                        </Nav.Link>
                        {modules.map((item) => (
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