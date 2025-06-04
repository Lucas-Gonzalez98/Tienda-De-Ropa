import { useContext } from 'react'
import { carritoContext } from '../context/CarritoContext'

export function useCarrito() {
  const context = useContext(carritoContext);
  if (!context) {
    throw new Error("useCarrito debe ser usado dentro del ambito de un CartProvider");
  }
  return context;
}