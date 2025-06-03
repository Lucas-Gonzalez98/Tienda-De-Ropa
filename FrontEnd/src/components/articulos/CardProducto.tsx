import React from "react";
import { useNavigate } from "react-router-dom";
import Articulo from "../../models/Producto";
import "../../styles/productocard.css"; // Import your CSS styles
interface Props {
  articulo: Articulo;
}

const CardArticulo: React.FC<Props> = ({ articulo }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card-articulo"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        width: "400px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/articulo/${articulo.id}`)}
    >
      <img
        src={articulo.imagenes[0]?.denominacion || "/placeholder.png"}
        alt={articulo.nombre || "Artículo sin imagen"}
        style={{ width: "100%", height: "120px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h6>{articulo.nombre}</h6>
        <p>${articulo.precio}</p>
      </div>
    </div>
  );
};

export default CardArticulo;