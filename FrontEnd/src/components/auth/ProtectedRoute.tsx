
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
    clientOnly?: boolean; // nueva prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, clientOnly = false }) => {
    const { currentUser, usuario, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!currentUser || !usuario) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && usuario.rol !== 'ADMINISTRADOR') {
        return <Navigate to="/" replace />;
    }

    if (clientOnly && usuario.rol !== 'CLIENTE') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;