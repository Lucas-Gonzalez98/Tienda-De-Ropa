import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import ImagenProducto from "../../models/ImagenProducto";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../../styles/DetalleProducto.css"; // estilos opcionales adicionales
import type Producto from "../../models/Producto";

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<ImagenProducto | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    cargarProducto();
  }, []);

  const cargarProducto = async () => {
    setLoading(true);
    try {
      const data = await ProductoService.getById(parseInt(id!));
      setProducto(data);
      if (data.imagenes && data.imagenes.length > 0) {
        setImagenSeleccionada(data.imagenes[0]);
      }
    } catch (err) {
      setError("Error al cargar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const coloresDisponibles = ["Negro", "Blanco", "Gris", "Bordó", "Azul acero"];
  const tallesDisponibles = ["S", "M", "L", "XL", "XXL"];

  if (loading) return <Spinner animation="border" className="mt-5" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!producto) return null;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Imágenes */}
        <div className="col-md-6">
          <div className="mb-3 text-center">
            <img
              src={imagenSeleccionada?.denominacion || ""}
              alt="Imagen principal"
              className="img-fluid border rounded"
              style={{ maxHeight: 400, objectFit: "contain" }}
            />
          </div>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            {producto.imagenes.map((img) => (
              <img
                key={img.id}
                src={img.denominacion}
                alt="Miniatura"
                className={`img-thumbnail ${img.id === imagenSeleccionada?.id ? "border-primary" : ""}`}
                style={{ width: 60, height: 60, cursor: "pointer", objectFit: "cover" }}
                onClick={() => setImagenSeleccionada(img)}
              />
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="col-md-6">
          <h3>{producto.nombre}</h3>
          <p className="text-muted">{producto.descripcion}</p>
          <h4 className="text-success">${producto.precio.toLocaleString()}</h4>
          <p><strong>Stock disponible:</strong> 1 unidad</p>

          <div className="mt-4">
            <p><strong>Color:</strong></p>
            <div className="d-flex flex-wrap gap-2">
              {coloresDisponibles.map((color) => (
                <Button
                  key={color}
                  variant={colorSeleccionado === color ? "dark" : "outline-secondary"}
                  onClick={() => setColorSeleccionado(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p><strong>Talle:</strong></p>
            <div className="d-flex flex-wrap gap-2">
              {tallesDisponibles.map((talle) => (
                <Button
                  key={talle}
                  variant={talleSeleccionado === talle ? "dark" : "outline-secondary"}
                  onClick={() => setTalleSeleccionado(talle)}
                >
                  {talle}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="mt-4 w-100"
            variant="primary"
            size="lg"
            disabled={!colorSeleccionado || !talleSeleccionado}
            onClick={() => alert("Compra realizada")}
          >
            Comprar ahora
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
