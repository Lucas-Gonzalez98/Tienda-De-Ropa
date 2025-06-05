import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import ImagenProducto from "../../models/ImagenProducto";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../../styles/DetalleProducto.css";
import type Producto from "../../models/Producto";
import { useCarrito } from "../../hooks/useCarrito";
import StockService from "../../services/StockService";
import TallesService from "../../services/TallesService";
import Color from "../../models/Color";
import Talle from "../../models/Talle";
import ColorService from "../../services/ColorService";

function DetalleProducto() {
  const carritoCtx = useCarrito();
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<ImagenProducto | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<Color | null>(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState<Talle | null>(null);
  const [colores, setColores] = useState<Color[]>([]);
  const [talles, setTalles] = useState<Talle[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [stockDisponible, setStockDisponible] = useState<number | null>(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [productoData, tallesData, coloresData] = await Promise.all([
          ProductoService.getById(parseInt(id!)),
          TallesService.getAll(),
          ColorService.getAll()
        ]);
        setProducto(productoData);
        setImagenSeleccionada(productoData.imagenes?.[0] || null);
        setTalles(tallesData);
        setColores(coloresData);

        // Consultar stock para cada combinación
        const stockTemp: Record<string, number> = {};
        for (const color of coloresData) {
          for (const talle of tallesData) {
            const cantidad = await StockService.consultarStock(productoData.id, talle.id, color.id);
            stockTemp[`${color.id}-${talle.id}`] = cantidad;
          }
        }
        setStockMap(stockTemp);
      } catch (err) {
        setError("Error al cargar el producto o datos asociados.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [id]);

  useEffect(() => {
    if (colorSeleccionado && talleSeleccionado) {
      const stock = stockMap[`${colorSeleccionado.id}-${talleSeleccionado.id}`] ?? null;
      setStockDisponible(stock);
    } else {
      setStockDisponible(null);
    }
  }, [colorSeleccionado, talleSeleccionado, stockMap]);

  const handleAgregarAlCarrito = () => {
    if (carritoCtx && producto && stockDisponible && stockDisponible > 0) {
      carritoCtx.agregarAlCarrito(producto, 1); // Podrías incluir color y talle aquí si lo manejás
    }
  };

  const isColorHabilitado = (color: Color) => {
    if (!talleSeleccionado) return true;
    return stockMap[`${color.id}-${talleSeleccionado.id}`] > 0;
  };

  const isTalleHabilitado = (talle: Talle) => {
    if (!colorSeleccionado) return true;
    return stockMap[`${colorSeleccionado.id}-${talle.id}`] > 0;
  };

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
          <p><strong>Stock disponible:</strong> {stockDisponible ?? "Seleccioná talle y color"}</p>

          {/* Colores */}
          <div className="mt-4">
            <p><strong>Color:</strong></p>
            <div className="d-flex flex-wrap gap-2">
              {colores.map((color) => (
                <Button
                  key={color.id}
                  variant={colorSeleccionado?.id === color.id ? "dark" : "outline-secondary"}
                  onClick={() =>
                    colorSeleccionado?.id === color.id
                      ? setColorSeleccionado(null)
                      : setColorSeleccionado(color)
                  }
                  disabled={!isColorHabilitado(color)}
                >
                  {color.nombre}
                </Button>
              ))}
            </div>
          </div>

          {/* Talles */}
          <div className="mt-3">
            <p><strong>Talle:</strong></p>
            <div className="d-flex flex-wrap gap-2">
              {talles.map((talle) => (
                <Button
                  key={talle.id}
                  variant={talleSeleccionado?.id === talle.id ? "dark" : "outline-secondary"}
                  onClick={() =>
                    talleSeleccionado?.id === talle.id
                      ? setTalleSeleccionado(null)
                      : setTalleSeleccionado(talle)
                  }
                  disabled={!isTalleHabilitado(talle)}
                >
                  {talle.nombre}
                </Button>
              ))}
            </div>
          </div>
          {/* Botón agregar */}
          <button
            onClick={handleAgregarAlCarrito}
            disabled={!stockDisponible}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: stockDisponible ? "pointer" : "not-allowed",
              marginTop: "10px"
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
