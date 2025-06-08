import { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import Pedido from "../../models/Pedido";
import { useCarrito } from "../../hooks/useCarrito";
import HistoricoPrecioventaService from "../../services/HistoricoPrecioVentaService";
import trashIcon from "../../assets/trash-xmark-svgrepo-com.svg";
import { Link } from "react-router-dom";

export function Carrito() {
  const carritoCtx = useCarrito();
  const [pedidoGuardado, setPedidoGuardado] = useState<Pedido | null>(null);
  const [preciosActualizados, setPreciosActualizados] = useState<Record<number, number>>({});
  if (!carritoCtx) return null;

  const {
    pedido,
    restarDelCarrito,
    agregarAlCarrito,
    quitarDelCarrito,
    limpiarCarrito,
    enviarPedido,
    guardarPedidoYObtener
  } = carritoCtx;

  const carrito = pedido.detalles;
  useEffect(() => {
    const obtenerPrecios = async () => {
      const precios: Record<number, number> = {};
      for (const item of carrito) {
        try {
          if(item.producto.id){
            const historico = await HistoricoPrecioventaService.ultimoById(item.producto.id);
            precios[item.producto.id] = historico.precio;
          }
        } catch {
          if(item.producto.id){
            precios[item.producto.id] = item.producto.precio ?? 0; // fallback con default
          }
        }
      }
      setPreciosActualizados(precios);
    };

    if (carrito.length > 0) {
      obtenerPrecios();
    }
  }, [carrito]);
  return (
    <div className="m-auto container">
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          carrito.map((item) => (
            <div key={item.producto.id} className="row d-flex align-items-center mb-3 border-bottom pb-2">
              <Image
                src={item.producto.imagenes[0]?.denominacion}
                alt={"Imagen del artículo"}
                style={{ width: "200px", height: "auto", objectFit: "cover", marginRight: "10px" }}
                rounded
                />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-2 pb-2">
                  <strong>{item.producto.nombre}</strong>
                  <Button
                    style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}
                    variant="outline-danger"
                    size="sm"
                    onClick={() => quitarDelCarrito(item.producto.id ? item.producto.id : 0)}
                  >
                    <img src={trashIcon} alt="Eliminar" style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column align-items-start">
                    <small>
                      Talle: 
                      {item.producto.talle?.nombre}
                    </small>

                    <small>
                      Color: 
                      {item.producto.color?.nombre}
                    </small>
                    {item.producto.id !== undefined &&
                      <small>
                        Precio: $
                        {preciosActualizados[item.producto.id]?.toFixed(2) ?? "Cargando..."}
                      </small>
                    }
                  </div>
                  <div className="d-flex align-items-center mx-2">
                    <Button
                      style={{ background: "white", color: "black" }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => restarDelCarrito(item.producto.id ? item.producto.id : 0)}
                    >
                      <strong>-</strong>
                    </Button>
                    <span className="mx-2">{item.cantidad}</span>
                    <Button
                      style={{ background: "white", color: "black" }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => agregarAlCarrito(item.producto, 1)}
                    >
                      <strong>+</strong>
                    </Button>
                  </div>
                </div>
                {item.producto.id !== undefined &&
                <div className="text-end">
                  Subtotal: $
                  {((preciosActualizados[item.producto.id] ?? 0) * item.cantidad).toFixed(2)}
                </div>
                }
              </div>
            </div>
          ))
        )}
        {carrito.length > 0 && (
          <>
            <div className="mt-3 text-end">
              <strong>
                Total: $
                {carrito
                  .reduce((acc, item) => {
                    const id = item.producto.id;
                    const precio = typeof id === "number" ? preciosActualizados[id] ?? 0 : 0;
                    return acc + precio * item.cantidad;
                  }, 0)
                  .toFixed(2)}
              </strong>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="warning" onClick={limpiarCarrito}>Limpiar carrito</Button>
              <Link to='/confirmado'>Confirmar pedido</Link>
            </div>
          </>
        )}
    </div>
  );
}
