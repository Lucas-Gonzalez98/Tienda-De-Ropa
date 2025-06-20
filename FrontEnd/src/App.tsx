import './App.css'
import Navbar from './components/layout/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/layout/Home'
import Perfil from './components/auth/Perfil'
import Productos from "./components/articulos/Productos.tsx";
import PanelAdmin from "./components/admin/PanelAdmin.tsx";
import {AuthProvider, useAuth} from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FormProducto from './components/articulos/FormProductos.tsx'
import FormCategoria from './components/articulos/FormCategoria.tsx'
import Domicilios from "./components/cliente/Domicilios.tsx";
import PedidoCliente from "./components/cliente/PedidoCliente.tsx";
import DetalleProducto from './components/articulos/DetalleProducto.tsx'
import { Carrito } from './components/articulos/Carrito.tsx'
import { CarritoProvider } from './context/CarritoContext.tsx'
import Footer from "./components/layout/Footer.tsx";
import { FormStock } from './components/articulos/FormStock.tsx'
import { PedidoConfirmado } from './components/articulos/PedidoConfirmado.tsx'

function App() {
  return (
    <AuthProvider>
    <CarritoProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        
        {/* Rutas protegidas */}
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />

        <Route path="/domicilios" element={
          <ProtectedRoute clientOnly={true}>
            <Domicilios />
          </ProtectedRoute>
        } />

        <Route path="/carrito" element={
            <Carrito />
        } />

        <Route path="/confirmado" element={
          <ProtectedRoute clientOnly={true}>
            <PedidoConfirmado />
          </ProtectedRoute>
        } />

        <Route path="/pedidos" element={
          <ProtectedRoute clientOnly={true}>
            <PedidoCliente /> {/* o el componente correcto de pedidos si tenés otro */}
          </ProtectedRoute>
        } />


        {/* Ruta solo para administradores */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <PanelAdmin />
          </ProtectedRoute>
        } />
        <Route path="/fromproducto" element={
          <ProtectedRoute adminOnly={true}>
            <FormProducto />
          </ProtectedRoute>
        } />
        <Route path="/fromcategoria" element={
          <ProtectedRoute adminOnly={true}>
            <FormCategoria />
          </ProtectedRoute>
        } />
        <Route path="/fromStock" element={
          <ProtectedRoute adminOnly={true}>
            <FormStock />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Home />} />
      </Routes>

      <ConditionalFooter/>
    </CarritoProvider>
    </AuthProvider>
  )
}

function ConditionalFooter() {
  const { isAdmin } = useAuth();
  return !isAdmin ? <Footer /> : null;
}
export default App