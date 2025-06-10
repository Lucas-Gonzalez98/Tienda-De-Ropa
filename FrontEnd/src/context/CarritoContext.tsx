import { createContext, useState } from "react";
import type { ReactNode } from "react";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/PedidoDetalle";
import PedidoService from "../services/PedidoService";
import { useAuth } from "./AuthContext";
import type Cliente from "../models/Cliente";
import HistoricoPrecioVentaService from "../services/HistoricoPrecioVentaService";
import type Stock from "../models/Stock";

interface CarritoContextProps {
  pedido: Pedido;
  preferenceId: string;
  agregarAlCarrito: (stock: Stock, cantidad: number) => void;
  quitarDelCarrito: (idStock: number) => void;
  restarDelCarrito: (idStock: number) => void;
  AgregarPreferenceId: (id: string) => void;
  limpiarCarrito: () => void;
  enviarPedido: () => Promise<void>;
  guardarPedidoYObtener: () => Promise<Pedido | null>;
}

export const carritoContext = createContext<CarritoContextProps | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { userData } = useAuth();
  const [pedido, setPedido] = useState<Pedido>(() => {
    const nuevoPedido = new Pedido();
    const hoy = new Date();
    const soloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    nuevoPedido.fecha = soloFecha;
    nuevoPedido.detalles = [];
    nuevoPedido.cliente = userData as Cliente
    return nuevoPedido;
  });
  const [preferenceId, setIdPreference ] = useState<string>("");

  const AgregarPreferenceId = (id: string) => {
    setIdPreference(id);
  }

  const agregarAlCarrito = (stock: Stock, cantidad: number) => {
  setPedido((prevPedido) => {
    const detallesExistente = prevPedido.detalles.find(
      (d) => d.stock.id === stock.id
    );
    let nuevosdetalles: PedidoDetalle[];
    if (detallesExistente) {
      nuevosdetalles = prevPedido.detalles.map((d) => {
        if (d.stock.id === stock.id) {
          const nuevaCantidad = d.cantidad + cantidad;
          return {
            ...d,
            cantidad: nuevaCantidad,
          };
        }
        return d;
      });
    } else {
      const nuevoDetalles = new PedidoDetalle();
      nuevoDetalles.stock = stock;
      nuevoDetalles.cantidad = cantidad;
      const nuevoPrecio = () =>{
        HistoricoPrecioVentaService.ultimoById(stock.producto.id!).then((res) => nuevoDetalles.precio = res.precio)
      } 
      nuevoPrecio()
      nuevosdetalles = [...prevPedido.detalles, nuevoDetalles];
    }

    return { ...prevPedido, detalles: nuevosdetalles };
  });
};

const restarDelCarrito = (idstock: number) => {
  setPedido((prevPedido) => {
    const nuevosdetalles = prevPedido.detalles
      .map((d) => {
        console.log("cantidad: ", d)
        if (d.stock.id === idstock) {
          const nuevaCantidad = d.cantidad - 1;
          console.log("canttidadnueva: ", nuevaCantidad)
          if (nuevaCantidad <= 0) return null;
          return {
            ...d,
            cantidad: nuevaCantidad,
          };
        }
        return d;
      })
      .filter((d): d is PedidoDetalle => d !== null);

    return { ...prevPedido, detalles: nuevosdetalles };
  });
};

  const quitarDelCarrito = (idstock: number) => {
    setPedido((prevPedido) => {
      const nuevosdetalles = prevPedido.detalles.filter(
        (d) => d.stock.id !== idstock
      );
      return { ...prevPedido, detalles: nuevosdetalles };
    });
  };

  const limpiarCarrito = () => {
    const nuevoPedido = new Pedido();
    nuevoPedido.fecha = new Date();
    nuevoPedido.detalles = [];
    setPedido(nuevoPedido);
  };

  const enviarPedido = async () => {
    if (pedido.detalles.length === 0) {
      alert("El carrito está vacío. No se puede enviar el pedido.");
      return;
    }

    try {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().split(' ')[0];
      console.log("Hora actual:", horaActual);
      pedido.estado = "PENDIENTE";
      PedidoService.create(pedido)
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el pedido.");
    }
  };

  const guardarPedidoYObtener = async (): Promise<Pedido | null> => {
    if (pedido.detalles.length === 0) {
      alert("El carrito está vacío. No se puede guardar el pedido.");
      return null;
    }

    try {
      pedido.estado = "PENDIENTE";
      console.log(pedido)
      const response = PedidoService.create(pedido)

      return response;
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el pedido.");
      return null;
    }
  };
  return (
    <carritoContext.Provider
      value={{
        pedido,
        preferenceId,
        agregarAlCarrito,
        restarDelCarrito,
        quitarDelCarrito,
        limpiarCarrito,
        AgregarPreferenceId,
        enviarPedido,
        guardarPedidoYObtener,
      }}
    >
      {children}
    </carritoContext.Provider>
  );
}