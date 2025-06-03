import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './components/layout/Home'
import Perfil from './components/auth/Perfil'
import Productos from "./components/articulos/Productos.tsx";
import PanelAdmin from "./components/admin/PanelAdmin.tsx";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FormProducto from './components/articulos/FormProductos.tsx'
import FormCategoria from './components/articulos/FormCategoria.tsx'
import Domicilios from "./components/auth/Domicilios.tsx";

function App() {
  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        
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

        <Route path="/pedidos" element={
          <ProtectedRoute clientOnly={true}>
            <Perfil /> {/* o el componente correcto de pedidos si tenés otro */}
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
        
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer/>
    </AuthProvider>
  )
}

export default App