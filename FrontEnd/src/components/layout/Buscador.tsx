import { useState, useEffect } from 'react';
import '../../styles/buscador.css';
import Ham from '../../assets/images/hamburguesa.png';

function Buscador() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  // Maneja el cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Consulta la API cuando cambia el query
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/productos/buscar/denominacion?denominacion=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      }
    };

    fetchData();
  }, [query]);
  return (
    <>
      <section className="buscador d-flex flex-column">

      <div className="search-bar" style={{ borderRadius: results.length === 0 ? '30px' : '30px 30px 0 0' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-search"
          >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          value={query}
          onChange={handleInputChange}
          />
      </div>
      <div className="search-results position-absolute overflow-hidden p-10 d-flex align-items-start justify-content-center flex-column" style={{ padding: results.length === 0 ? '0' : '15px' }}>
        {results.length > 0 && (
          <ul className='listaProductoBuscado overflow-hidde list-unstyled d-flex flex-column gap-2 w-100'>
        {results.slice(0, 3).map((producto: any) => {
        // Selecciona el último precio del histórico (por fecha más reciente)
        const historicos = producto.historicosPrecioVenta;
        let ultimoPrecio = '';
        if (historicos && historicos.length > 0) {
          // Ordena por fecha descendente y toma el primero
          const ultimoHistorico = [...historicos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
          ultimoPrecio = ultimoHistorico.precio;
        }
        return (
          <li key={producto.id}>
            <a className='linkProductoBsucado text-black d-flex text-start' href="">
              <img className='imgProductoBuscado' src={Ham} alt="asd" />
              <div className='d-flex flex-column'>
                <span>{producto.denominacion}</span>
                <span className='precioProductoBuscado'>${ultimoPrecio}</span>
              </div>
            </a>
          </li>
          );
        })}
          </ul>
        )}
      </div>
        </section>
    </>
  );
}

export default Buscador;