import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ModalDomicilio from './ModalDomicilio'; // Asegurate que el path sea correcto

const Domicilios: React.FC = () => {
    const { userData } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<any | null>(null);
    const [domicilios, setDomicilios] = useState(userData?.domicilios || []);

    const handleAgregar = () => {
        setDireccionSeleccionada(null);
        setShowModal(true);
    };

    const handleEditar = (domicilio: any) => {
        setDireccionSeleccionada(domicilio);
        setShowModal(true);
    };

    const handleGuardar = (nuevoDomicilio: any) => {
        if (!nuevoDomicilio) return;

        setDomicilios(prev => {
            const existe = prev.find(d => d.id === nuevoDomicilio.id);
            if (existe) {
                // Actualización
                return prev.map(d => d.id === nuevoDomicilio.id ? nuevoDomicilio : d);
            } else {
                // Nuevo domicilio
                return [...prev, nuevoDomicilio];
            }
        });

        setShowModal(false);
    };

    const handleDesasociar = async (domicilio: any) => {
        if (!userData?.id) return;

        if (!window.confirm("¿Estás seguro de desasociar esta dirección?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/cliente/${userData.id}/domicilios/${domicilio.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error al desasociar domicilio: ${response.status}`);
            }

            // Actualizar la lista local de domicilios
            setDomicilios(prev => prev.filter(d => d.id !== domicilio.id));
        } catch (error) {
            console.error("Error al desasociar domicilio:", error);
            alert("Ocurrió un error al desasociar el domicilio.");
        }
    };

    if (!userData) {
        return <div className="text-center mt-5">Cargando domicilios...</div>;
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center fw-bold mb-4">Mis Domicilios</h2>

            <div className="d-flex justify-content-start mb-4">
                <Button variant="dark" onClick={handleAgregar}>
                    <FaPlus className="me-2" />
                    Agregar dirección
                </Button>
            </div>

            {domicilios.map((domicilio) => (
                <Card key={domicilio.id} className="mb-3 shadow-sm">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={9}>
                                <h5 className="mb-1 fw-semibold">{domicilio.referencia}</h5>
                                <p className="mb-0">
                                    {domicilio.calle} {domicilio.numero} - CP {domicilio.codigoPostal}, {domicilio.localidad.nombre}
                                </p>
                            </Col>
                            <Col md={3} className="text-end">
                                <Button variant="dark" className="me-2" onClick={() => handleEditar(domicilio)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="dark" onClick={() => handleDesasociar(domicilio)}>
                                    <FaTrash />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}

            <ModalDomicilio
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleGuardar}
                direccionActual={direccionSeleccionada}
            />
        </Container>
    );
};

export default Domicilios;
