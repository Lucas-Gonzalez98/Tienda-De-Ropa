import { useEffect, useState } from "react";
import { useCarrito } from "../../hooks/useCarrito";
import '../../styles/PedidoConfirmado.css'
import { BotonWallet } from "./BotonWallet";
import { Image } from "react-bootstrap";
import HistoricoPrecioVentaService from "../../services/HistoricoPrecioVentaService";


export function PedidoConfirmado(){
    const carritoCtx = useCarrito();
    const [ total, setTotal ] = useState(0)
    const [preciosActualizados, setPreciosActualizados] = useState<Record<number, number>>({});

    if (!carritoCtx) return null;
    const {
        pedido,
        preferenceId
    } = carritoCtx;
    useEffect(()=>{

        if (carritoCtx){
            let totalPedido = 0
            pedido.detalles.map((det)=>(
                totalPedido += det.precio * det.cantidad
            ))
            setTotal(totalPedido)
        }
    },[]);
    useEffect(() => {
    if (pedido) {
        const totalPedido = pedido.detalles.reduce((acc, det) => acc + det.precio * det.cantidad, 0);
        setTotal(totalPedido);
    }
    }, [pedido]);
    const carrito = pedido.detalles
    useEffect(() => {
        const obtenerPrecios = async () => {
          const precios: Record<number, number> = {};
          for (const item of carrito) {
            try {
              if(item.stock.producto.id){
                const historico = await HistoricoPrecioVentaService.ultimoById(item.stock.producto.id);
                precios[item.stock.producto.id] = historico.precio;
              }
            } catch {
              if(item.stock.producto.id){
                precios[item.stock.producto.id] = item.stock.producto.precio ?? 0; // fallback con default
              }
            }
          }
          setPreciosActualizados(precios);
        };
    
        if (carrito.length > 0) {
          obtenerPrecios();
        }
      }, [carrito]);
    return(
        <>
        <div className="d-flex">
            <div className="m-auto container">
                {carrito.length === 0 ? (
                <p>El carrito está vacío.</p>
                ) : (
                carrito.map((item) => (
                    <div key={item.stock.id} className="row d-flex align-items-center mb-3 border-bottom pb-2">
                        <Image
                        src={item.stock.producto.imagenes[0]?.denominacion}
                        alt={"Imagen del artículo"}
                        style={{ width: "200px", height: "auto", objectFit: "cover", marginRight: "10px" }}
                        rounded
                        />
                        <div className="flex-grow-1">
                        <div className="d-flex justify-content-between mb-2 pb-2">
                            <strong>{item.stock.producto.nombre}</strong>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex flex-column align-items-start">
                            <small>Talle: {item.stock.talle?.nombre}</small>
                            <small>Color: {item.stock.color?.nombre}</small>
                            <small>Precio: ${item.precio.toFixed(2)}</small>
                            </div>
                            <div className="text-end">
                            Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                            </div>
                        </div>
                        </div>
                    </div>
                    )))}

                {carrito.length > 0 && (
                    <div className="mt-3 text-end">
                    <strong>
                        Total: $
                        {carrito
                        .reduce((acc, item) => {
                            const id = item.stock.producto.id;
                            const precio = typeof id === "number" ? preciosActualizados[id] ?? 0 : 0;
                            return acc + precio * item.cantidad;
                        }, 0)
                        .toFixed(2)}
                    </strong>
                    </div>
                )}
            </div>
            <div className="confirmarPedido d-flex" style={{margin: "50px auto", justifyContent: "space-around"}}>
                <div className="resumenPedido">
                    <div className="resumen p-3 mb-3" style={{ border: "1px solid gray", borderRadius: "10px" }}>
                        <h5>Resumen del pedido</h5>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <span>Productos:</span>
                            <span>{pedido.detalles.length} ítems</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>${total}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Envío:</span>
                            <span>$7500</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>${total + 7500}</span>
                        </div>
                    </div>
                    <BotonWallet idPreference={preferenceId}/>
                </div>
            </div>
        </div>
        </>
    )
}