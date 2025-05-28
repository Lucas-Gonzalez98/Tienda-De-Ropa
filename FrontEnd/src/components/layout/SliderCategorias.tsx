import CategoriaCard from '../articulos/CategoriaCard';
import Ham from '../../assets/images/hamburguesa.png';
import FlechaDerecha from '../../assets/flecha.svg';
import FlechaIzquierda from '../../assets/flechaIzquierda.svg';
import { useState } from 'react';
const categorias = [
    { img: Ham, nombre: "Hamburguesa" },
    { img: Ham, nombre: "Pizza" },
    { img: Ham, nombre: "Empanada" },
    { img: Ham, nombre: "Lomito" },
    { img: Ham, nombre: "Papas" },
    { img: Ham, nombre: "Bebidas" }
];

function Slider(){
    const [start, setStart] = useState(0);
    const visibleCount = 5;

    const handleNext = () => {
        setStart((prev) => (prev + 1) % categorias.length);
    };

    const handlePrev = () => {
        setStart((prev) => (prev - 1) % categorias.length);
    };

    // Para mostrar solo 5 categorías a la vez, con loop circular
    const visibleCategorias = [];
    for (let i = 0; i < visibleCount; i++) {
        visibleCategorias.push(categorias[(start + i) % categorias.length]);
    }
    return(
        <>
            <div className="sliderCategorias">
                <button
                    className="flechaIzquierda"
                    onClick={handlePrev}
                    disabled={start === 0}
                >
                    <img src={FlechaIzquierda} alt="Siguiente" />
                </button>
                {visibleCategorias.map((cat) => (
                    <CategoriaCard categoria={cat}/>
                ))}
                <button className='flechaDerecha' onClick={handleNext}>
                    <img src={FlechaDerecha} alt="Siguiente" />
                </button>
            </div>
        </>
    )
}

export default Slider;