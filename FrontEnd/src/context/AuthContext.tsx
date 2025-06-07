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
    loginExitoso: boolean;
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
    const loginExitoso = !!currentUser && !!userData;


    const fetchUserData = async (firebaseUid: string, retries = 3) => {
        // Buscar el usuario por Firebase UID
        const usuarioResponse = await fetch(`http://localhost:8080/api/usuario/firebase/${firebaseUid}`);

        if (!usuarioResponse.ok) {
            if (retries > 0) {
                console.log(`Usuario no encontrado, reintentando... (${retries} intentos restantes)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await fetchUserData(firebaseUid, retries - 1);
            }
            throw new Error('Usuario no encontrado en la base de datos');
        }

        const usuarioData: Usuario = await usuarioResponse.json();
        setUsuario(usuarioData);

        // Obtener datos del rol
        if (usuarioData.rol === 'ADMINISTRADOR') {
            const adminResponse = await fetch(`http://localhost:8080/api/administrador/usuario/${usuarioData.id}`);
            if (!adminResponse.ok) throw new Error('Error al obtener datos del administrador');
            const adminData: Administrador = await adminResponse.json();
            setUserData(adminData);
        } else if (usuarioData.rol === 'CLIENTE') {
            const clienteResponse = await fetch(`http://localhost:8080/api/cliente/usuario/${usuarioData.id}`);
            if (!clienteResponse.ok) throw new Error('Error al obtener datos del cliente');
            const clienteData: Cliente = await clienteResponse.json();

            if (clienteData.eliminado) {
                await auth.signOut();
                throw new Error("Cuenta inactiva");
            }

            setUserData(clienteData);
        }
    };


    const login = async (firebaseUser: User): Promise<void> => {
        await fetchUserData(firebaseUser.uid);
        setCurrentUser(firebaseUser);
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
        logout,
        loginExitoso
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};