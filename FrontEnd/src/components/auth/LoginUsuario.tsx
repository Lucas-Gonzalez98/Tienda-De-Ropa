import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { auth } from "./firebase";
import { useAuth } from "../../context/AuthContext";

interface Props {
    onRegisterClick: () => void;
}

const LoginUsuario: React.FC<Props> = ({ onRegisterClick }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Sesión iniciada con éxito:");
            console.log(JSON.stringify(userCredential.user, null, 2));

            // Usar el contexto para establecer el usuario y obtener sus datos
            await login(userCredential.user);

            setMessage("¡Inicio de sesión exitoso!");

            // Cerrar el modal automáticamente después del login exitoso
            setTimeout(() => {
                window.location.reload(); // O usar una función para cerrar el modal
            }, 1000);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Email o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-center fw-bold">Iniciar Sesión</h3>
            <hr style={{ width: "150px", borderTop: "3px solid blue", margin: "0 auto 20px" }} />

            <Form onSubmit={handleLogin}>
                <Form.Group controlId="email" className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <div className="d-grid gap-2 mb-3">
                    <Button
                        variant="dark"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onRegisterClick}
                        className="btn btn-link"
                    >
                        ¿No tenés cuenta? Registrate
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default LoginUsuario;