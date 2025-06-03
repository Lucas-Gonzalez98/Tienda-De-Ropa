import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "../../context/AuthContext";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

interface Props {
    onRegisterClick: () => void;
}

const LoginUsuario = ({ onRegisterClick }: Props) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
            console.log("Sesión iniciada:", userCredential.user);
            await login(userCredential.user);
            setMessage("¡Inicio de sesión exitoso!");
            
            // El modal se cerrará automáticamente por el useEffect en Navbar
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Email o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email || !confirmEmail) {
            setError("Por favor completá ambos campos.");
            return;
        }

        if (email !== confirmEmail) {
            setError("Los emails no coinciden.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Te enviamos un correo para restablecer tu contraseña.");
            setError(null);
        } catch (error) {
            console.error("Error al enviar recuperación:", error);
            setError("No se pudo enviar el correo. Verificá que el email esté registrado.");
            setMessage(null);
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-center fw-bold">
                {step === 1 ? "Iniciar Sesión" : "Recuperar Contraseña"}
            </h3>
            <hr style={{ width: "150px", borderTop: "3px solid blue", margin: "0 auto 20px" }} />

            <Form onSubmit={handleLogin}>
                {step === 1 && (
                    <>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {message && <div className="alert alert-success">{message}</div>}

                        <div className="d-grid gap-2 mb-2">
                            <Button variant="dark" type="submit" disabled={loading}>
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                        </div>

                        <div className="text-center mt-2">
                            <Button 
                                variant="link" 
                                size="sm" 
                                onClick={() => setStep(2)}
                                disabled={loading}
                            >
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </div>

                        <div className="text-center mt-3">
                            <span>¿No tenés cuenta?</span><br />
                            <Button 
                                variant="link" 
                                onClick={onRegisterClick}
                                disabled={loading}
                            >
                                Registrate
                            </Button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {message && <div className="alert alert-success">{message}</div>}

                        <div className="d-grid gap-2">
                            <Button 
                                variant="dark" 
                                onClick={handlePasswordReset}
                                disabled={loading}
                            >
                                {loading ? "Enviando..." : "Enviar correo de recuperación"}
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                ← Volver al login
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};

export default LoginUsuario;