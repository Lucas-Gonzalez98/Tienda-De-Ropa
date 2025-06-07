import { useAuth } from '../../context/AuthContext.tsx'; // Ajusta la ruta si es diferente
import "../../styles/perfil.css"
import { sendPasswordResetEmail,  updateEmail, EmailAuthProvider, reauthenticateWithCredential  } from 'firebase/auth';
import { auth } from './firebase.ts';
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import {obtenerUsuarioPorEmail} from "../../services/UsuarioService.ts";
import type Cliente from "../../models/Cliente.ts";


function Perfil() {
    const { userData, usuario, isAdmin, isClient, logout } = useAuth();
// modal email
    const [showModal, setShowModal] = useState(false);
    const [newEmail1, setNewEmail1] = useState('');
    const [newEmail2, setNewEmail2] = useState('');

    const [email1Error, setEmail1Error] = useState('');
    const [email2Error, setEmail2Error] = useState('');

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('')

    const [showPersonalModal, setShowPersonalModal] = useState(false);
    const [nombre, setNombre] = useState(userData.nombre);
    const [apellido, setApellido] = useState(userData.apellido);
    const [fechaNacimiento, setFechaNacimiento] = useState(
        isClient && userData.fechaNacimiento
            ? userData.fechaNacimiento.split('T')[0]
            : ''
    );// para input date
    const [telefono, setTelefono] = useState(userData.telefono?.numero || '');
    const [telefonoFormateado, setTelefonoFormateado] = useState(userData.telefono?.numero || '');
    const [telefonoError, setTelefonoError] = useState('');


    const esTelefonoValido = (telefono: string): boolean => {
        const soloNumeros = telefono.replace(/\D/g, "");
        return soloNumeros.length === 10;
    };


    const formatearTelefono = (valor: string): string => {
        // Elimina cualquier cosa que no sea número
        const soloNumeros = valor.replace(/\D/g, "").slice(0, 10); // máx 10 dígitos

        if (soloNumeros.length <= 3) return soloNumeros;
        if (soloNumeros.length <= 6) {
            return `${soloNumeros.slice(0, 3)}-${soloNumeros.slice(3)}`;
        }
        return `${soloNumeros.slice(0, 3)}-${soloNumeros.slice(3, 6)}-${soloNumeros.slice(6)}`;
    };


    const esEmailValido = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleCerrarSesion = async () => {
        if (window.confirm("¿Seguro que quieres cerrar sesion?")){
        await logout();
        window.location.href = '/'; // Redirige al home después del logout
        }
    };

    const handleNewEmail1Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewEmail1(value);
        setEmail1Error('');

        if (!esEmailValido(value)) {
            setEmail1Error('Ingresá un email válido');
            return;
        }

        if (value === usuario.email) {
            setEmail1Error('Este ya es tu email actual');
            return;
        }

        try {
            const usuarioExistente = await obtenerUsuarioPorEmail(value);
            if (usuarioExistente) {
                setEmail1Error('El email ya está en uso');
            }
        } catch (err) {
            console.error("Error verificando email:", err);
        }
    };

    const handleNewEmail2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewEmail2(value);
        setEmail2Error('');

        if (newEmail1 && value !== newEmail1) {
            setEmail2Error('Los emails no coinciden');
        }
    };


    const handleEmailChange = async () => {
        setError('');
        setSuccess('');

        if (!newEmail1 || !newEmail2) {
            setError('Completá ambos campos de email.');
            return;
        }

        if (!esEmailValido(newEmail1)) {
            setEmail1Error('Ingresá un email válido');
            return;
        }

        if (newEmail1 !== newEmail2) {
            setEmail2Error('Los emails no coinciden');
            return;
        }

        if (email1Error || email2Error) {
            setError('Revisá los campos con error.');
            return;
        }

        const user = auth.currentUser;

        if (user && password) {
            try {
                const email = user.email ?? '';
                const credential = EmailAuthProvider.credential(email, password);

                // Reautenticación
                await reauthenticateWithCredential(user, credential);

                // Actualizar email en Firebase desde el BACKEND
                try {
                    await axios.put(`http://localhost:8080/api/usuario/${usuario.firebaseUid}/email`, null, {
                        params: {
                            nuevoEmail: newEmail1
                        }
                    });

                    // Actualizar tu base de datos
                    await axios.put(`http://localhost:8080/api/usuario/${usuario.id}`, {
                        ...usuario,
                        email: newEmail1,
                    });

                    setSuccess("Email actualizado correctamente.");
                    window.location.reload();
                } catch (emailErr: any) {
                    console.error("Error al actualizar el email desde el backend:", emailErr);
                    setError("No se pudo actualizar el email: " + emailErr.message);
                }
            } catch (err: any) {
                console.error('Error en reautenticación:', err);
                setError(err.message || 'Error al reautenticar.');
            }
        }
    };




    const handleCambiarContrasena = async () => {
        if (window.confirm('¿Deseas cambiar tu contraseña? Se enviará un mail para continuar el proceso.')) {
            if (usuario?.email) {
                try {
                    await sendPasswordResetEmail(auth, usuario.email);
                    alert('Se ha enviado un correo para restablecer tu contraseña.');
                } catch (error: any) {
                    alert('Error al enviar el correo: ' + error.message);
                }
            }
        }
    }

    if (!userData || !usuario) {
        return <div className="perfil text-center mt-5">Cargando datos del perfil...</div>;
    }

    return (
        <div className="perfil d-flex flex-column justify-content-center align-items-center">
            <h1 className="perfilTitle d-flex align-items-center flex-column">Mi Perfil</h1>
            <div className="perfilContainer d-flex">
                <div className="perfilInfo text-start">
                    <p className="perfilInfoText">Nombre: {userData.nombre} {userData.apellido}</p>
                    <p className="perfilInfoText">Email: {usuario.email}</p>

                    {isClient && (
                        <>
                            <p>
                                Fecha de Nacimiento: {userData.fechaNacimiento.split('T')[0].split('-').reverse().join('/')}
                            </p>

                        </>
                    )}

                    <p className="perfilInfoText">Teléfono: {userData.telefono?.numero}</p>

                    {isAdmin && userData.domicilio && (
                        <p className="perfilInfoText">
                            Domicilio: {userData.domicilio.calle} {userData.domicilio.numero}, {userData.domicilio.localidad.nombre}, {userData.domicilio.localidad.provincia.nombre}, {userData.domicilio.localidad.provincia.pais.nombre}
                        </p>
                    )}
                </div>
                <img src={IconoEmpresa} alt="Imagen de perfil" className="perfilImagen w-auto rounded-circle" />
            </div>

            <div className="buttons d-flex flex-column justify-content-center align-items-center">
                { isClient && (
                <button className="perfilButton" onClick={() => setShowPersonalModal(true)}>
                    Cambiar datos personales
                </button>
                )}
                <button className="perfilButton" onClick={() => setShowModal(true)}>Cambiar el Mail</button>
                <button className="perfilButton" onClick={handleCambiarContrasena}>Cambiar Contraseña</button>
                <button className="perfilButton" onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </div>
            {/* modal email */ }
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Cambiar el mail te pedira que vuelvas a loguearte a la pagina.</p>

                    <Form>
                        <Form.Group>
                            <Form.Label>Nuevo Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail1}
                                onChange={handleNewEmail1Change}
                                placeholder="Ingresá tu nuevo email"
                                isInvalid={!!email1Error}
                            />
                            <Form.Control.Feedback type="invalid">
                                {email1Error}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Repetir Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail2}
                                onChange={handleNewEmail2Change}
                                placeholder="Repetí tu nuevo email"
                                isInvalid={!!email2Error}
                            />
                            <Form.Control.Feedback type="invalid">
                                {email2Error}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Contraseña actual</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresá tu contraseña"
                            />
                        </Form.Group>
                        {error && <p className="text-danger mt-2">{error}</p>}
                        {success && <p className="text-success mt-2">{success}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleEmailChange}>
                        Cambiar Email
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* modal personal */ }

            <Modal show={showPersonalModal} onHide={() => setShowPersonalModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Datos Personales</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="fechaNacimiento" className="mb-2">
                            <div className="d-flex p-1 align-items-end" style={{ width: "100%" }}>
                                <Form.Label style={{ width: "300px" }}> Fecha de nacimiento: </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="telefono" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Teléfono"
                                value={telefonoFormateado}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const soloNumeros = input.replace(/\D/g, "").slice(0, 10); // Solo 10 dígitos

                                    setTelefono(soloNumeros); // Guardamos sin formato
                                    setTelefonoFormateado(formatearTelefono(soloNumeros)); // Mostramos formateado

                                    // Validamos longitud
                                    if (soloNumeros.length < 10) {
                                        setTelefonoError("El número debe tener exactamente 10 dígitos.");
                                    } else {
                                        setTelefonoError('');
                                    }
                                }}
                                isInvalid={!!telefonoError}

                            />
                            <Form.Control.Feedback type="invalid">
                                {telefonoError}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                El número debe tener 10 dígitos, sin el 15 y con el código de área.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPersonalModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={async () => {
                            try {
                                if (!esTelefonoValido(telefono)) {
                                    setTelefonoError("El número debe tener exactamente 10 dígitos.");
                                    return;
                                }


                                await axios.put(`http://localhost:8080/api/cliente/${userData?.id}`, {
                                    ...userData,
                                    nombre,
                                    apellido,
                                    fechaNacimiento,
                                    telefono: { ...userData.telefono, numero: telefono }
                                });
                                alert('Datos actualizados correctamente');
                                window.location.reload();
                            } catch (err) {
                                alert('Error al actualizar los datos');
                                console.error(err);
                            }
                        } }
                    >
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>


    );
}

export default Perfil;
