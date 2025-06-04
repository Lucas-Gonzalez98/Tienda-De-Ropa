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


function Perfil() {
    const { userData, usuario, isAdmin, isClient, logout } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [newEmail1, setNewEmail1] = useState('');
    const [newEmail2, setNewEmail2] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCerrarSesion = async () => {
        if (window.confirm("¿Seguro que quieres cerrar sesion?")){
        await logout();
        window.location.href = '/'; // Redirige al home después del logout
        }
    };

    const handleEmailChange = async () => {
        setError('');
        setSuccess('');

        if (newEmail1 !== newEmail2) {
            setError('Los correos no coinciden.');
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
                    <h2 className="perfilInfoTitle">Información Personal</h2>
                    <p className="perfilInfoText">Nombre: {userData.nombre} {userData.apellido}</p>
                    <p className="perfilInfoText">Email: {usuario.email}</p>

                    {isClient && (
                        <>
                            <p className="perfilInfoText">Fecha de Nacimiento: {new Date(userData.fechaNacimiento).toLocaleDateString()}</p>
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
                <button className="perfilButton">Cambiar datos personales</button>
                <button className="perfilButton" onClick={() => setShowModal(true)}>Cambiar el Mail</button>
                <button className="perfilButton" onClick={handleCambiarContrasena}>Cambiar Contraseña</button>
                <button className="perfilButton" onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </div>
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
                                onChange={(e) => setNewEmail1(e.target.value)}
                                placeholder="Ingresá tu nuevo email"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Repetir Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail2}
                                onChange={(e) => setNewEmail2(e.target.value)}
                                placeholder="Repetí tu nuevo email"
                            />
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

        </div>


    );
}

export default Perfil;
