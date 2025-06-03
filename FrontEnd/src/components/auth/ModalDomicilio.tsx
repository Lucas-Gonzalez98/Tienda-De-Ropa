import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import {
    getPaises,
    getProvincias,
    getLocalidades,
    Pais,
    Provincia,
    Localidad
} from "../../services/LocalizacionApi";
import {useAuth} from "../../context/AuthContext.tsx";

interface Props {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: any) => void;
    direccionActual?: any; // si existe, es edición
}

const ModalDomicilio: React.FC<Props> = ({ show, onHide, onSubmit, direccionActual }) => {
    const [loading, setLoading] = useState(true);
    const { userData } = useAuth();
    const clienteId = userData?.id; // ejemplo si usás Firebase + backend


    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidadesTodas, setLocalidadesTodas] = useState<Localidad[]>([]);

    const [pais, setPais] = useState("");
    const [provincia, setProvincia] = useState("");
    const [localidadId, setLocalidadId] = useState<number | null>(null);
    const [localidadesFiltradas, setLocalidadesFiltradas] = useState<Localidad[]>([]);

    const [codigoPostal, setCodigoPostal] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [referencia, setReferencia] = useState("");

    // Carga de datos inicial
    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const [paises, provincias, localidades] = await Promise.all([
                    getPaises(),
                    getProvincias(),
                    getLocalidades()
                ]);
                setPaises(paises);
                setProvincias(provincias);
                setLocalidadesTodas(localidades);
            } catch (e) {
                console.error("Error cargando datos de localización:", e);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // Si es edición, precargar datos
    useEffect(() => {
        if (direccionActual) {
            setPais(direccionActual.localidad.provincia.pais.nombre);
            setProvincia(direccionActual.localidad.provincia.nombre);
            setLocalidadId(direccionActual.localidad.id);
            setCodigoPostal(direccionActual.codigoPostal.toString());
            setCalle(direccionActual.calle);
            setNumero(direccionActual.numero);
            setReferencia(direccionActual.referencia);
        } else {
            // Reset
            setPais("");
            setProvincia("");
            setLocalidadId(null);
            setCodigoPostal("");
            setCalle("");
            setNumero("");
            setReferencia("");
        }
    }, [direccionActual, show]);

    useEffect(() => {
        const filtradas = localidadesTodas.filter(
            (loc) => loc.provincia.nombre === provincia
        );
        setLocalidadesFiltradas(filtradas);
    }, [provincia, localidadesTodas]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localidadId) return;
        if (!calle.trim() || !numero.trim() || !codigoPostal.trim()) {
            alert("Por favor completá todos los campos requeridos.");
            return;
        }

        const data = {
            calle,
            numero,
            codigoPostal: Number(codigoPostal),
            referencia,
            localidad: {
                id: localidadId
            }
        };

        try {
            const url = direccionActual
                ? `http://localhost:8080/api/domicilio/${direccionActual.id}`
                : `http://localhost:8080/api/cliente/${clienteId}/domicilios`;

            const method = direccionActual ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error al ${direccionActual ? 'actualizar' : 'guardar'} domicilio: ${response.status}`);
            }

            const result = await response.json();
            console.log(`Domicilio ${direccionActual ? 'actualizado' : 'guardado'}:`, result);
            onSubmit(result);
            window.location.reload()
        } catch (error) {
            console.error("Error al guardar domicilio:", error);
            alert("Ocurrió un error al guardar el domicilio.");
        }
    };


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{direccionActual ? "Editar Dirección" : "Nueva Dirección"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Select value={pais} onChange={(e) => setPais(e.target.value)} disabled={loading}>
                                <option value="">Seleccioná un país...</option>
                                {paises.map((p) => (
                                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Select value={provincia} onChange={(e) => setProvincia(e.target.value)} disabled={loading}>
                                <option value="">Seleccioná una provincia...</option>
                                {provincias.filter((p) => p.pais.nombre === pais).map((p) => (
                                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Select
                                value={localidadId || ""}
                                onChange={(e) => setLocalidadId(parseInt(e.target.value))}
                                disabled={!localidadesFiltradas.length}
                            >
                                <option value="">Seleccioná una localidad...</option>
                                {localidadesFiltradas.map((l) => (
                                    <option key={l.id} value={l.id}>{l.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder="Código Postal"
                                value={codigoPostal}
                                onChange={(e) => setCodigoPostal(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Calle"
                                value={calle}
                                onChange={(e) => setCalle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Número"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Referencia (piso, casa, etc)"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                            <Button type="submit" variant="primary">
                                {direccionActual ? "Guardar cambios" : "Agregar dirección"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ModalDomicilio;
