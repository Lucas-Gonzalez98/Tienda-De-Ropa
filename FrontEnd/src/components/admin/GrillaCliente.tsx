import { useEffect, useState } from "react";
import Cliente from "../../models/Cliente";
import ClienteService from "../../services/ClienteService";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonAlta from "../layout/BotonAlta";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function ClienteGrilla() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState("todos");
    const [ordenAsc, setOrdenAsc] = useState(true);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [mostrarDomicilios, setMostrarDomicilios] = useState(false);


    useEffect(() => {
        cargarClientes();
    }, []);

    useEffect(() => {
        filtrarClientes();
    }, [clientes, search, estado, ordenAsc]);

    const cargarClientes = async () => {
        try {
            const data = await ClienteService.getAll(); // /api/cliente/all
            setClientes(data);
        } catch (err) {
            alert("Error al cargar los clientes");
        }
    };

    const filtrarClientes = () => {
        let filtrados = [...clientes];

        if (estado !== "todos") {
            const eliminado = estado === "inactivos";
            filtrados = filtrados.filter(c => c.eliminado === eliminado);
        }

        if (search.trim() !== "") {
            const texto = search.toLowerCase();
            filtrados = filtrados.filter(c =>
                `${c.nombre} ${c.apellido}`.toLowerCase().includes(texto) ||
                c.usuario?.email.toLowerCase().includes(texto)
            );
        }

        filtrados.sort((a, b) => {
            const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
            const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
            return ordenAsc ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
        });

        setFilteredClientes(filtrados);
    };

    const eliminarCliente = async (id: number) => {
        if (!window.confirm("¿Seguro que desea eliminar este cliente?")) return;
        try {
            await ClienteService.delete(id); // /api/cliente/{id}
            await cargarClientes();
            alert("Cliente eliminado correctamente");
        } catch (err) {
            alert("Error al eliminar el cliente");
        }
    };

    const darDeAlta = async (id: number) => {
        if (!window.confirm("¿Desea dar de alta este cliente?")) return;
        try {
            await ClienteService.restore(id); // /api/cliente/restore/{id}
            await cargarClientes();
            alert("Cliente dado de alta correctamente");
        } catch (err) {
            alert("Error al dar de alta el cliente");
        }
    };

    const handleVer = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setClienteSeleccionado(null);
    };

    const columns = [
        {
            key: "id",
            label: "Id",
            render: (_: any, row: Cliente) => row.id,
        },
        {
            key: "nombreApellido",
            label: "Nombre y Apellido",
            render: (_: any, row: Cliente) => `${row.nombre} ${row.apellido}`,
        },
        {
            key: "email",
            label: "Email",
            render: (_: any, row: Cliente) => row.usuario?.email,
        },
        {
            key: "telefono",
            label: "Teléfono",
            render: (_: any, row: Cliente) => row.telefono?.numero,
        },
        {
            key: "estado",
            label: "Estado",
            render: (_: any, row: Cliente) => (row.eliminado ? "Inactivo" : "Activo"),
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (_: any, row: Cliente) => (
                <div className="d-flex justify-content-center">
                    <BotonVer onClick={() => handleVer(row)} />
                    {!row.eliminado ? (
                        <BotonEliminar onClick={() => eliminarCliente(row.id!)} />
                    ) : (
                        <BotonAlta onClick={() => darDeAlta(row.id!)} />
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <h2>Clientes</h2>

            <div className="d-flex gap-3 mb-3">
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </Form.Select>
                <Button variant="outline-secondary" onClick={() => setOrdenAsc(!ordenAsc)}>
                    Orden: {ordenAsc ? "A-Z" : "Z-A"}
                </Button>
            </div>

            <ReusableTable data={filteredClientes} columns={columns} />

            {/* Modal de detalle */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Cliente - Id: {clienteSeleccionado?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {clienteSeleccionado && (
                        <div>
                            <p><b>Nombre:</b> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
                            <p><b>Email:</b> {clienteSeleccionado.usuario.email}</p>
                            <p><b>Teléfono:</b> {clienteSeleccionado.telefono.numero}</p>
                            <p><b>Estado:</b> {clienteSeleccionado.eliminado ? "Inactivo" : "Activo"}</p>

                            <div className="mt-3">
                                <button
                                    className="btn btn-outline-secondary btn-sm mb-2"
                                    onClick={() => setMostrarDomicilios(prev => !prev)}
                                >
                                    {mostrarDomicilios ? "Ocultar domicilios" : "Mostrar domicilios"}
                                </button>

                                {mostrarDomicilios && (
                                    <ul className="list-group">
                                        {clienteSeleccionado.domicilios.map((dom, idx) => (
                                            <li key={idx} className="list-group-item">
                                                <span><b>{dom.referencia}</b> - {dom.calle} {dom.numero} - CP {dom.codigoPostal} - {dom.localidad!.nombre}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ClienteGrilla;
