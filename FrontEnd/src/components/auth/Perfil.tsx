import "../../styles/perfil.css";
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';

function Perfil(){
    return(
        <div className="perfil d-flex flex-column justify-content-center align-items-center">
            <h1 className="perfilTitle d-flex align-items-center flex-column">Mi Perfil</h1>
            <div className="perfilContainer d-flex">
                <div className="perfilInfo text-start">
                    <h2 className="perfilInfoTitle">Información Personal</h2>
                    <p className="perfilInfoText">Nombre: Juan Pérez</p>
                    <p className="perfilInfoText">Email:juanc@gmail.com</p>
                </div>
                <img src={IconoEmpresa} alt="Imagen de perfil" className="perfilImagen w-auto rounded-circle" />
            </div>
            <div className="buttons d-flex flex-column justify-content-center align-items-center">
                <button className="perfilButton">Cambiar datos personales</button>
                <button className="perfilButton">Cambiar Contraseña</button>
                <button className="perfilButton">Cerrar Secion</button>
            </div>
        </div>
    )
}

export default Perfil;