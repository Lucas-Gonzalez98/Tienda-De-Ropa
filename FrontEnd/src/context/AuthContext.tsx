import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../components/auth/firebase';
import { User } from 'firebase/auth';
import Cliente from '../models/Cliente';
import Administrador from '../models/Administrador';
import Usuario from '../models/Usuario';

interface AuthContextType {
    currentUser: User | null;
    userData: Cliente | Administrador | null;
    usuario: Usuario | null;
    loading: boolean;
    isAdmin: boolean;
    isClient: boolean;
    login: (firebaseUser: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<Cliente | Administrador | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (firebaseUid: string) => {
        try {
            // Buscar el usuario por Firebase UID
            const usuarioResponse = await fetch(`http://localhost:8080/api/usuario/firebase/${firebaseUid}`);
            
            if (!usuarioResponse.ok) {
                throw new Error('Usuario no encontrado');
            }

            const usuarioData: Usuario = await usuarioResponse.json();
            setUsuario(usuarioData);

            // Según el rol, obtener los datos completos usando el ID del usuario
            if (usuarioData.rol === 'ADMINISTRADOR') {
                const adminResponse = await fetch(`http://localhost:8080/api/administrador/usuario/${usuarioData.id}`);
                if (adminResponse.ok) {
                    const adminData: Administrador = await adminResponse.json();
                    setUserData(adminData);
                } else {
                    console.error('Error al obtener datos del administrador');
                }
            } else if (usuarioData.rol === 'CLIENTE') {
                const clienteResponse = await fetch(`http://localhost:8080/api/cliente/usuario/${usuarioData.id}`);
                if (clienteResponse.ok) {
                    const clienteData: Cliente = await clienteResponse.json();
                    setUserData(clienteData);
                } else {
                    console.error('Error al obtener datos del cliente');
                }
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setUsuario(null);
            setUserData(null);
        }
    };

    const login = async (firebaseUser: User) => {
        setCurrentUser(firebaseUser);
        await fetchUserData(firebaseUser.uid);
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setCurrentUser(null);
            setUserData(null);
            setUsuario(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
                await fetchUserData(user.uid);
            } else {
                setCurrentUser(null);
                setUserData(null);
                setUsuario(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const isAdmin = usuario?.rol === 'ADMINISTRADOR';
    const isClient = usuario?.rol === 'CLIENTE';

    const value: AuthContextType = {
        currentUser,
        userData,
        usuario,
        loading,
        isAdmin,
        isClient,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};