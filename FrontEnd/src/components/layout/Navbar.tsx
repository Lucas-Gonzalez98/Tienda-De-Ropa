import '../../styles/navbar.css'
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import Vector from '../../assets/Carrito.svg';
import Buscador from './Buscador';
import  { useState, useEffect } from 'react';
import { Modal, Dropdown } from 'react-bootstrap';
import LoginUsuario from '../auth/LoginUsuario.tsx';
import RegisterUsuario from '../auth/RegisterUsuario.tsx';
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const { currentUser, userData, isAdmin, logout } = useAuth();

    // Cerrar modal cuando el usuario se autentica
    useEffect(() => {
        if (currentUser) {
            setShowModal(false);
        }
    }, [currentUser]);

    const handleOpenLogin = () => {
        setIsLoginView(true);
        setShowModal(true);
    };

    const handleOpenRegister = () => {
        setIsLoginView(false);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const getUserDisplayName = () => {
        if (userData) {
            return `${userData.nombre} ${userData.apellido}`;
        }
        return currentUser?.email || 'Usuario';
    };

    return (
        <>
            <nav>
                <a className='homeNav' href="/"><img className='logoEmpresa' src={IconoEmpresa} alt="Icono Empresa" /><span>M- SHOP</span></a>
                <Buscador />
                <div className="navButtons">
                    <Link className="nav-link" to="/productos">Tienda</Link>
                    
                    {/* Solo mostrar administración si es admin */}
                    {isAdmin && (
                        <Link className="nav-link" to="/admin">Administración</Link>
                    )}

                    {currentUser ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-user">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                    <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79薢086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="ms-2">{getUserDisplayName()}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/perfil">
                                    Mi Perfil
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                {!isAdmin && (
                                    <>
                                <Dropdown.Item as={Link} to="/perfil">
                                    Mis Domicilios
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} to="/perfil">
                                    Mis Pedidos
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                    </>
                                )}
                                <Dropdown.Item onClick={handleLogout}>
                                    Cerrar Sesión
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <button className='btnLogin' onClick={handleOpenLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Iniciar Sesión</span>
                        </button>
                    )}

                    {!isAdmin && (
                        <img className='carrito' src={Vector} alt="logoCarrito" />
                    )}
                </div>
            </nav>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="modal-header-custom">
                    <img className='logoEmpresa' src={IconoEmpresa} alt="Icono Empresa" />
                    <Modal.Title className="modal-title-custom">M - SHOP</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoginView ? (
                        <LoginUsuario onRegisterClick={handleOpenRegister} />
                    ) : (
                        <RegisterUsuario onBackToLogin={handleOpenLogin} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Navbar;