import { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import Pedido from "../../models/Pedido";
import { useCarrito } from "../../hooks/useCarrito";
import HistoricoPrecioventaService from "../../services/HistoricoPrecioventaService";
import trashIcon from "../../assets/trash-xmark-svgrepo-com.svg";

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
          const historico = await HistoricoPrecioventaService.ultimoById(item.producto);
          precios[item.producto.id] = historico.precio;
        } catch {
          precios[item.producto.id] = item.producto.precio; // fallback al precio del modelo
        }
      }
      setPreciosActualizados(precios);
    };

    if (carrito.length > 0) {
      obtenerPrecios();
    }
  }, [carrito]);
  console.log("Carrito:", carrito);
  const handlePagarConMP = async () => {
    const pedidoFinal = await guardarPedidoYObtener();
    if (pedidoFinal) {
      setPedidoGuardado(pedidoFinal);
    }
    console.log(pedidoGuardado)
  };
  
  return (
    <div className="w-full p-4">
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          carrito.map((item) => (
            <div key={item.producto.id} className="d-flex align-items-center mb-3 border-bottom pb-2">
              <Image
                src={item.producto.imagenes[0]?.denominacion}
                alt={"Imagen del artículo"}
                style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px" }}
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
                  <small>
                    Precio: $
                    {preciosActualizados[item.producto.id]?.toFixed(2) ?? "Cargando..."}
                  </small>

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
                <div>
                  Subtotal: $
                  {((preciosActualizados[item.producto.id] ?? 0) * item.cantidad).toFixed(2)}
                </div>

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
                  .reduce((acc, item) => acc + (preciosActualizados[item.producto.id] ?? 0) * item.cantidad, 0)
                  .toFixed(2)}
              </strong>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="warning" onClick={limpiarCarrito}>Limpiar carrito</Button>
              <Button variant="success" onClick={enviarPedido}>Guardar pedido</Button>
            </div>
            <div className="mt-3">
            <Button variant="primary" onClick={handlePagarConMP}>
              Pagar con Mercado Pago
            </Button>
            </div>
          </>
        )}
    </div>
  );
}
