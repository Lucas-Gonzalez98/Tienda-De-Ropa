import { createContext, useState } from "react";
import type { ReactNode } from "react";
import Producto from "../models/Producto";
import Pedido from "../models/Pedido";
import PedidoDetalle from "../models/PedidoDetalle";
import PedidoService from "../services/PedidoService";
import { useAuth } from "./AuthContext";
import type Cliente from "../models/Cliente";

interface CarritoContextProps {
  pedido: Pedido;
  agregarAlCarrito: (Producto: Producto, cantidad: number) => void;
  quitarDelCarrito: (idProducto: number) => void;
  restarDelCarrito: (idProducto: number) => void;
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

  const agregarAlCarrito = (producto: Producto, cantidad: number) => {
  setPedido((prevPedido) => {
    const detallesExistente = prevPedido.detalles.find(
      (d) => d.producto.id === producto.id &&
      d.producto.talle?.id === producto.talle?.id &&
      d.producto.color?.id === producto.color?.id
    );
    let nuevosdetalles: PedidoDetalle[];
    if (detallesExistente) {
      nuevosdetalles = prevPedido.detalles.map((d) => {
        if (d.producto.id === producto.id &&
      d.producto.talle?.id === producto.talle?.id &&
      d.producto.color?.id === producto.color?.id) {
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
      nuevoDetalles.producto = producto;
      nuevoDetalles.cantidad = cantidad;
      nuevosdetalles = [...prevPedido.detalles, nuevoDetalles];
    }

    return { ...prevPedido, detalles: nuevosdetalles };
  });
};

const restarDelCarrito = (idProducto: number) => {
  setPedido((prevPedido) => {
    const nuevosdetalles = prevPedido.detalles
      .map((d) => {
        if (d.producto.id === idProducto) {
          const nuevaCantidad = d.cantidad - 1;
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

  const quitarDelCarrito = (idProducto: number) => {
    setPedido((prevPedido) => {
      const nuevosdetalles = prevPedido.detalles.filter(
        (d) => d.producto.id !== idProducto
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
      const ahora = new Date();
      const horaActual = ahora.toTimeString().split(' ')[0];
      console.log("Hora actual:", horaActual);

      PedidoService.create(pedido)
      const pedidoTemporal = new Pedido();
      return pedidoTemporal;
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
        agregarAlCarrito,
        restarDelCarrito,
        quitarDelCarrito,
        limpiarCarrito,
        enviarPedido,
        guardarPedidoYObtener,
      }}
    >
      {children}
    </carritoContext.Provider>
  );
}