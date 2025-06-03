import { useAuth } from '../../context/AuthContext.tsx'; // Ajusta la ruta si es diferente
import "../../styles/perfil.css"
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase.ts';
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';

function Perfil() {
    const { userData, usuario, isAdmin, isClient, logout } = useAuth();

    const handleCerrarSesion = async () => {
        if (window.confirm("¿Seguro que quieres cerrar sesion?")){
        await logout();
        window.location.href = '/'; // Redirige al home después del logout
        }
    };

    const handleCambiarContrasena = async () => {
        if (window.confirm('¿Deseas cambiar tu contraseña? Se enviará un mail para continuar el proceso.')) {
            if (usuario?.email) {
                try {
                    await sendPasswordResetEmail(auth, usuario.email);
                    alert('Se ha enviado un correo para restablecer tu contraseña.');
                } catch (error: any) {
                    alert('Error al enviar el correo: ' + error.message);
                }
            }
        }
    }

    if (!userData || !usuario) {
        return <div className="perfil text-center mt-5">Cargando datos del perfil...</div>;
    }

    return (
        <div className="perfil d-flex flex-column justify-content-center align-items-center">
            <h1 className="perfilTitle d-flex align-items-center flex-column">Mi Perfil</h1>
            <div className="perfilContainer d-flex">
                <div className="perfilInfo text-start">
                    <h2 className="perfilInfoTitle">Información Personal</h2>
                    <p className="perfilInfoText">Nombre: {userData.nombre} {userData.apellido}</p>
                    <p className="perfilInfoText">Email: {usuario.email}</p>

                    {isClient && (
                        <>
                            <p className="perfilInfoText">Fecha de Nacimiento: {new Date(userData.fechaNacimiento).toLocaleDateString()}</p>
                        </>
                    )}

                    <p className="perfilInfoText">Teléfono: {userData.telefono?.numero}</p>

                    {isAdmin && userData.domicilio && (
                        <p className="perfilInfoText">
                            Domicilio: {userData.domicilio.calle} {userData.domicilio.numero}, {userData.domicilio.localidad.nombre}, {userData.domicilio.localidad.provincia.nombre}, {userData.domicilio.localidad.provincia.pais.nombre}
                        </p>
                    )}
                </div>
                <img src={IconoEmpresa} alt="Imagen de perfil" className="perfilImagen w-auto rounded-circle" />
            </div>

            <div className="buttons d-flex flex-column justify-content-center align-items-center">
                <button className="perfilButton">Cambiar datos personales</button>
                <button className="perfilButton" onClick={handleCambiarContrasena}>Cambiar Contraseña</button>
                <button className="perfilButton" onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Perfil;
