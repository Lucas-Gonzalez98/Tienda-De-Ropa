import { createUserWithEmailAndPassword, updateProfile, signOut} from "firebase/auth";
import { useState, useEffect} from "react";
import { Button, Form } from "react-bootstrap";
import {auth} from "./firebase.ts";
import  Cliente from "../../models/Cliente.ts";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import {
    getPaises,
    getProvincias,
    getLocalidades,
    type Pais,
    type Provincia,
    type Localidad
} from "../../services/LocalizacionApi.ts";
import {obtenerUsuarioPorEmail} from "../../services/UsuarioService.ts";

interface Props {
    onBackToLogin: () => void;
}

const RegisterUsuario = ({ onBackToLogin }: Props) => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [telefonoError, setTelefonoError] = useState('');


    // Primer paso
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    // Segundo paso
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [telefono, setTelefono] = useState(""); // solo números
    const [telefonoFormateado, setTelefonoFormateado] = useState("");

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
    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidadesTodas, setLocalidadesTodas] = useState<Localidad[]>([]);

    const [pais, setPais] = useState("");
    const [provincia, setProvincia] = useState("");
    const [localidadId, setLocalidadId] = useState<number | null>(null);
    const [localidadesFiltradas, setLocalidadesFiltradas] = useState<Localidad[]>([]);

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nombreProvincia = e.target.value;
        setProvincia(nombreProvincia);
        setLocalidadId(null);

        const localidadesFiltradas = localidadesTodas.filter(
            (loc) => loc.provincia.nombre === nombreProvincia
        );
        setLocalidadesFiltradas(localidadesFiltradas);
    };

    const [codigoPostal, setCodigoPostal] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [referencia, setReferencia] = useState("");


    const passwordValida = (password: string): boolean => {
        const tieneLongitudMinima = password.length >= 8;
        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneMinuscula = /[a-z]/.test(password);
        const tieneSimbolo = /[^A-Za-z0-9]/.test(password);

        return tieneLongitudMinima && tieneMayuscula && tieneMinuscula && tieneSimbolo;
    };

    const esEmailValido = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(null);

        if (!esEmailValido(newEmail)) {
            setEmailError("Ingresá un email válido");
            return;
        }

        try {
            const usuario = await obtenerUsuarioPorEmail(newEmail);
            if (usuario) {
                setEmailError("El email ya está en uso");
            }
        } catch (error) {
            console.error("Error al verificar email:", error);
        }
    };

    const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setNumero(value);
        }
    };

    const validateStep1 = async () => {
        if (!nombre || !apellido || !email || !contrasena || !confirmarContrasena) {
            setFormError("Por favor completá todos los campos.");
            return;
        }
        if (!esEmailValido(email)) {
            setFormError("Ingresá un email válido.");
            return;
        }

        if (contrasena !== confirmarContrasena) {
            setFormError("Las contraseñas no coinciden.");
            return;
        }
        if (!passwordValida(contrasena)) {
            setFormError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.");
            return;
        }
        const usuarioPorEmail = await obtenerUsuarioPorEmail(email);
        if (usuarioPorEmail) {
            setFormError("El email ya está registrado.");
            setLoading(false);
            return;
        }

        setFormError(null);
        setStep(2);
    };

    useEffect(() => {
        const fetchData = async () => {
            const paisesData = await getPaises();
            const provinciasData = await getProvincias();
            const localidadesData = await getLocalidades();

            setPaises(paisesData);
            setProvincias(provinciasData);
            setLocalidadesTodas(localidadesData);
        };

        fetchData();
    }, []);

    const handleRegister = async () => {
        if (contrasena !== confirmarContrasena) {
            setFormError("Las contraseñas no coinciden.");
            return;
        }
        if (!fechaNacimiento || !telefono || !pais || !provincia || !localidadId || !codigoPostal || !calle || !numero || !referencia) {
            setFormError("Por favor completá todos los campos del segundo paso.");
            return;
        }
        if (!esTelefonoValido(telefono)) {
            setTelefonoError("El número debe tener exactamente 10 dígitos.");
            return;
        }

        setLoading(true);
        setFormError(null);

        try {
            const usuarioPorEmail = await obtenerUsuarioPorEmail(email);
            if (usuarioPorEmail) {
                setFormError("El email ya está registrado.");
                setLoading(false);
                return;
            }

            // Crear usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, contrasena);

            // Actualizar perfil en Firebase
            await updateProfile(userCredential.user, {
                displayName: `${nombre} ${apellido}`
            });

            console.log("Usuario registrado en Firebase con éxito");

            // Crear objeto cliente
            const cliente: Cliente = {
                nombre: nombre,
                apellido: apellido,
                telefono: {
                    numero: telefono,
                    eliminado: false
                },
                fechaNacimiento: new Date(fechaNacimiento),
                eliminado: false,
                domicilios: [
                    {
                        calle: calle,
                        numero: parseInt(numero),
                        codigoPostal: codigoPostal,
                        referencia: referencia,
                        eliminado: false,
                        localidad: {
                            id: localidadId,
                        }
                    }
                ],
                usuario: {
                    email: email,
                    firebaseUid: userCredential.user.uid,
                    rol: "CLIENTE",
                    eliminado: false
                },
            };

            console.log("Cliente a enviar:", JSON.stringify(cliente, null, 2));

            // Enviar al backend
            const response = await fetch("http://localhost:8080/api/cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cliente)
            });

            if (!response.ok) {
                // Si falla el backend, eliminar el usuario de Firebase
                await userCredential.user.delete();
                throw new Error("Error al registrar cliente en el backend. Usuario Firebase eliminado.");
            }

            // Cerrar sesión automáticamente para evitar conflictos con AuthContext
            await signOut(auth);

            // Mostrar mensaje de éxito
            setFormError(null);
            alert("¡Registro exitoso! Ahora podés iniciar sesión con tu cuenta.");
            
            // Volver al login
            onBackToLogin();

        } catch (error: any) {
            console.error("Error al registrar:", error);

            // Eliminar usuario de Firebase si el proceso falló
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    await currentUser.delete();
                    console.log("Usuario Firebase eliminado por error en el proceso.");
                } catch (deleteError) {
                    console.error("Error al eliminar usuario de Firebase:", deleteError);
                }
            }

            setFormError(error.message || "Error desconocido durante el registro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-center fw-bold">Registrate !!!</h3>
            <hr style={{ width: "150px", borderTop: "3px solid blue", margin: "0 auto 20px" }} />

            <Form>
                {step === 1 && (
                    <>
                        <Form.Group controlId="nombre" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="apellido" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                isInvalid={!!emailError}
                                disabled={loading}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {emailError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="contrasena" className="mb-3">
                            <div className="input-group">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    disabled={loading}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                            <Form.Text className="text-muted">
                                La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un símbolo.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="confirmarContrasena" className="mb-3">
                            <div className="input-group">
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirmar Contraseña"
                                    value={confirmarContrasena}
                                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                                    disabled={loading}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </Form.Group>

                        <div className="d-grid gap-2 mb-2">
                            <Button variant="dark" onClick={validateStep1} disabled={loading}>
                                Siguiente →
                            </Button>
                            <Button variant="dark" onClick={onBackToLogin} disabled={loading}>
                                Salir
                            </Button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Form.Group controlId="fechaNacimiento" className="mb-2">
                            <div className="d-flex p-1 align-items-end" style={{ width: "100%" }}>
                                <Form.Label style={{ width: "300px" }}> Fecha de nacimiento: </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                    max={new Date().toISOString().split("T")[0]}
                                    disabled={loading}
                                    required
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
                                disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {telefonoError}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                El número debe tener 10 dígitos, sin el 15 y con el código de área.
                            </Form.Text>
                        </Form.Group>



                        <Form.Group controlId="pais" className="mb-2">
                            <Form.Select 
                                value={pais} 
                                onChange={(e) => setPais(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Seleccioná un país...</option>
                                {paises.map((p) => (
                                    <option key={p.id} value={p.nombre}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="provincia" className="mb-2">
                            <Form.Select 
                                value={provincia} 
                                onChange={handleProvinciaChange}
                                disabled={loading}
                            >
                                <option value="">Seleccioná una provincia...</option>
                                {provincias
                                    .filter((prov) => prov.pais.nombre === pais)
                                    .map((prov) => (
                                        <option key={prov.id} value={prov.nombre}>
                                            {prov.nombre}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="localidad" className="mb-2">
                            <Form.Select
                                value={localidadId || ""}
                                onChange={(e) => setLocalidadId(e.target.value ? parseInt(e.target.value) : null)}
                                disabled={!localidadesFiltradas.length || loading}
                            >
                                <option value="">Seleccioná una localidad...</option>
                                {localidadesFiltradas.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="codigoPostal" className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder="Código Postal"
                                value={codigoPostal}
                                onChange={(e) => setCodigoPostal(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="calle" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Calle"
                                value={calle}
                                onChange={(e) => setCalle(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex gap-2 mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Número"
                                value={numero}
                                onChange={handleNumeroChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <Form.Group controlId="referencia" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Referencia dirección (casa, departamento, piso, nro)"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button 
                                variant="dark" 
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                ← Atrás
                            </Button>
                            <Button 
                                variant="dark" 
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? "Registrando..." : "Registrarse"}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
            
            {formError && <div className="alert alert-danger mt-3">{formError}</div>}
            
            <div className="text-center mt-3">
                <button 
                    onClick={onBackToLogin} 
                    className="btn btn-link"
                    disabled={loading}
                >
                    ¿Ya tenés cuenta? Iniciar sesión
                </button>
            </div>
        </div>
    );
};

export default RegisterUsuario;