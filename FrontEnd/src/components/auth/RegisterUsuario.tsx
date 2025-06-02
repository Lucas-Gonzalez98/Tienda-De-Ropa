import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {auth} from "./firebase.ts";
import type Cliente from "../../models/Cliente.ts";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Requiere instalar `react-bootstrap-icons`


interface Props {
    onBackToLogin: () => void;
}

// === Datos hardcodeados ===
const paises = [
    { nombre: "Argentina", id: 1 }
];

const provincias = [
    { nombre: "Buenos Aires" },
    { nombre: "Catamarca" },
    { nombre: "Chaco" },
    { nombre: "Chubut" },
    { nombre: "Córdoba" },
    { nombre: "Corrientes" },
    { nombre: "Entre Ríos" },
    { nombre: "Formosa" },
    { nombre: "Jujuy" },
    { nombre: "La Pampa" },
    { nombre: "La Rioja" },
    { nombre: "Mendoza" },
    { nombre: "Misiones" },
    { nombre: "Neuquén" },
    { nombre: "Río Negro" },
    { nombre: "Salta" },
    { nombre: "San Juan" },
    { nombre: "San Luis" },
    { nombre: "Santa Cruz" },
    { nombre: "Santa Fe" },
    { nombre: "Santiago del Estero" },
    { nombre: "Tierra del Fuego" },
    { nombre: "Tucumán" },
    { nombre: "CABA" }
];

const localidadesPorProvincia: { [provincia: string]: string[] } = {
    "Mendoza": [
        "Mendoza",
        "Godoy Cruz",
        "Guaymallén",
        "Maipú",
        "Las Heras",
        "Luján de Cuyo",
        "San Rafael",
        "General Alvear",
        "Malargüe",
        "Rivadavia",
        "San Martín",
        "Tunuyán",
        "Tupungato",
        "San Carlos",
        "Lavalle",
        "Santa Rosa",
        "La Paz"
    ],
    // Puedes agregar localidades hardcodeadas para otras provincias si es necesario...
};



const RegisterUsuario = ({ onBackToLogin }: Props) => {
    const [step, setStep] = useState(1);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);


    // Primer paso
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    // Segundo paso
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pais, setPais] = useState("");
    const [provincia, setProvincia] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [localidades, setLocalidades] = useState<string[]>([]);

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prov = e.target.value;
        setProvincia(prov);
        setLocalidad(""); // reset
        setLocalidades(localidadesPorProvincia[prov] || []);
    };
    const [codigoPostal, setCodigoPostal] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [referencia, setReferencia] = useState("");

    const validateStep1 = () => {
        if (!nombre || !apellido || !email || !contrasena || !confirmarContrasena) {
            setFormError("Por favor completá todos los campos.");
            return;
        }
        if (contrasena !== confirmarContrasena) {
            setFormError("Las contraseñas no coinciden.");
            return;
        }
        if (contrasena.length < 6) {
            setFormError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setFormError(null);
        setStep(2);
    };


    const handleRegister = async () => {
        if (contrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        if (!fechaNacimiento || !telefono || !pais || !provincia || !localidad || !codigoPostal || !calle || !numero || !referencia) {
            setFormError("Por favor completá todos los campos del segundo paso.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, contrasena);

            // Opcional: actualizar el nombre de usuario en Firebase
            await updateProfile(userCredential.user, {
                displayName: `${nombre} ${apellido}`
            });

            console.log("Usuario registrado en firebases con éxito:");

            console.log(JSON.stringify(userCredential.user, null, 2));

            const cliente: Cliente = {
                nombre: nombre,
                apellido: apellido,
                telefono: telefono,
                email: email,
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
                            nombre: localidad,
                            eliminado: false,
                            provincia: {
                                nombre: provincia,
                                eliminado: false,
                                pais: {
                                    nombre: pais,
                                    eliminado: false
                                }
                            }
                        }
                    }
                ],
                usuario: {
                    email: email,
                    firebaseUid: userCredential.user.uid,
                    rol: "CLIENTE",
                    eliminado: false
                },
                pedidos: [] // si tu clase no lo requiere aún, podés omitir este campo
            };
            console.log("Cliente a enviar:", JSON.stringify(cliente, null, 2));


            // Enviar a backend
            /*
            const response = await fetch("http://localhost:8080/auth/cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await userCredential.user.getIdToken()}`
                },
                body: JSON.stringify(cliente)
            });

            if (!response.ok) {
                // Si falla el backend, eliminar el usuario de Firebase
                await userCredential.user.delete();
                throw new Error("Error al registrar cliente en el backend. Usuario Firebase eliminado.");
              }

            if (!response.ok) throw new Error("Error al registrar cliente en el backend");

            */

            alert("Registro exitoso!");
            onBackToLogin(); // Vuelve al login
        } catch (error: any) {
            console.error("Error al registrar:", error);

            // Eliminar usuario si ya fue creado pero el backend no estaba corriendo
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    await currentUser.delete();
                    console.log("Usuario Firebase eliminado por error en el proceso.");
                } catch (deleteError) {
                    console.error("Error al eliminar usuario de Firebase:", deleteError);
                }
            }

            alert(error.message || "Error desconocido durante el registro.");
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
                            />
                        </Form.Group>

                        <Form.Group controlId="apellido" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="contrasena" className="mb-3">
                            <div className="input-group">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                />
                                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="confirmarContrasena" className="mb-3">
                            <div className="input-group">
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirmar Contraseña"
                                    value={confirmarContrasena}
                                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                                />
                                <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </Form.Group>


                        <div className="d-grid gap-2 mb-2">
                            <Button variant="dark" onClick={validateStep1}>
                                Siguiente →
                            </Button>
                            <Button variant="dark" onClick={onBackToLogin}>
                                Salir
                            </Button>
                        </div>



                    </>
                )}

                {step === 2 && (
                    <>

                        <Form.Group controlId="fechaNacimiento" className="mb-2">
                            <div className="d-flex  p-1 align-items-end" style={{width: "100%"}}>
                                <Form.Label style={{width:"300px"}}> Fecha de nacimiento: </Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                            />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="telefono" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="pais" className="mb-2">
                            <Form.Select
                                value={pais}
                                onChange={e => setPais(e.target.value)}
                            >
                                <option value="">Seleccioná un país...</option>
                                {paises.map((p) => (
                                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                        <Form.Group controlId="provincia" className="mb-2">
                            <Form.Select
                                value={provincia}
                                onChange={handleProvinciaChange}
                            >
                                <option value="">Seleccioná una provincia...</option>
                                {provincias.map((prov, idx) => (
                                    <option key={idx} value={prov.nombre}>{prov.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="localidad" className="mb-2">
                            <Form.Select
                                value={localidad}
                                onChange={e => setLocalidad(e.target.value)}
                                disabled={!localidades.length}
                            >
                                <option value="">Seleccioná una localidad...</option>
                                {localidades.map((loc, idx) => (
                                    <option key={idx} value={loc}>{loc}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>



                        <Form.Group controlId="codigoPostal" className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder="Código Postal"
                                value={codigoPostal}
                                onChange={(e) => setCodigoPostal(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="calle" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Calle"
                                value={calle}
                                onChange={(e) => setCalle(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2 mb-2">
                            <Form.Control
                                type="number"
                                placeholder="Número"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                        </div>

                        <Form.Group controlId="referencia" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Referencia direccion(casa,departamento, piso, nro)"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="dark" onClick={() => setStep(1)}>
                                ← Atrás
                            </Button>
                            <Button variant="dark" onClick={handleRegister}>
                                Registrarse
                            </Button>

                        </div>
                    </>
                )}
            </Form>
            {formError && <div className="text-danger text-center mb-2">{formError}</div>}
            <div className="text-center mt-3">
                <button onClick={onBackToLogin} className="btn btn-link">
                    ¿Ya tenés cuenta? Iniciar sesión
                </button>
            </div>
        </div>
    );
};

export default RegisterUsuario;
