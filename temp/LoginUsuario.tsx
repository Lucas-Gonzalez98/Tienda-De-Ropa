// LoginUsuario.tsx
import { useState } from "react";

interface Props {
    onRegisterClick: () => void;
}

const LoginUsuario = ({ onRegisterClick }: Props) => {
    const [error] = useState<string | null>(null);



    return (
        <form>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" />
            </div>

            <button type="submit" className="btn btn-dark w-100 mb-2">Iniciar Sesión</button>

            {error && <div className="text-danger text-center mt-2">{error}</div>}

            <div className="text-center mt-2">
                <a href="#" className="text-primary small">¿Olvidaste tu contraseña?</a>
            </div>

            <hr />

            <div className="text-center mt-3">
                <span>¿No tenés cuenta?</span><br />
                <button type="button" onClick={onRegisterClick} className="btn btn-link">
                    Registrate
                </button>
            </div>
        </form>
    );
};

export default LoginUsuario;
