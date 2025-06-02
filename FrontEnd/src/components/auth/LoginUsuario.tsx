import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Requiere instalar `react-bootstrap-icons`

interface Props {
    onRegisterClick: () => void;
}

const LoginUsuario = ({ onRegisterClick }: Props) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👁️ Nuevo estado
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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
            setError("No se pudo enviar el correo. Verificá que el email esté registrado.");
            setMessage(null);
        }
    };

    return (
        <Form>
            {step === 1 && (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeSlash /> : <Eye />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit" variant="dark" className="w-100 mb-2">
                        Iniciar Sesión
                    </Button>

                    {error && <div className="text-danger text-center mt-2">{error}</div>}
                    {message && <div className="text-success text-center mt-2">{message}</div>}

                    <div className="text-center mt-2">
                        <Button variant="link" size="sm" onClick={() => setStep(2)}>
                            ¿Olvidaste tu contraseña?
                        </Button>
                    </div>

                    <hr />

                    <div className="text-center mt-3">
                        <span>¿No tenés cuenta?</span><br />
                        <Button variant="link" onClick={onRegisterClick}>
                            Registrate
                        </Button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h5 className="text-center mb-3">Recuperar Contraseña</h5>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="dark" onClick={handlePasswordReset}>
                            Enviar correo de recuperación
                        </Button>
                        <Button variant="secondary" onClick={() => setStep(1)}>
                            ← Volver al login
                        </Button>
                    </div>

                    {error && <div className="text-danger text-center mt-2">{error}</div>}
                    {message && <div className="text-success text-center mt-2">{message}</div>}
                </>
            )}
        </Form>
    );
};

export default LoginUsuario;
