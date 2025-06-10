import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Producto from "../../models/Producto";
import "../../styles/productocard.css"; // Import your CSS styles
import HistoricoPrecioventaService from "../../services/HistoricoPrecioVentaService";
interface Props {
  producto: Producto;
}

const CardProducto: React.FC<Props> = ({ producto }) => {
  const navigate = useNavigate();
  const [precioHistorico, setPrecioHistorico] = useState<number | null>(null);
  
  useEffect(() => {
  const obtenerPrecio = async () => {
      if (!producto) return;

      try {
        if (producto.id){
          const historico = await HistoricoPrecioventaService.ultimoById(producto.id);
          setPrecioHistorico(historico.precio)
          producto.precio =historico.precio
        }else{
          setPrecioHistorico(0)
        }
      } catch (error) {
        console.error("Error al obtener el precio histórico", error);
        setPrecioHistorico(null);
      }
    };

    obtenerPrecio();
  }, [producto]);


  return (
    <div
      className="card-producto"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        width: "400px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/producto/${producto.id}`)}
    >
      <img
        src={producto.imagenes[0]?.denominacion || "/placeholder.png"}
        alt={producto.nombre || "Artículo sin imagen"}
        style={{ width: "100%", height: "120px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h6>{producto.nombre}</h6>
        <p>${precioHistorico}</p>
      </div>
    </div>
  );
};

export default CardProducto;