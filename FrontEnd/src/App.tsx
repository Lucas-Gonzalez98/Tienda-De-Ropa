import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './components/layout/Home'
import Perfil from './components/auth/Perfil'
import Productos from "./components/articulos/Productos.tsx";
import PanelAdmin from "./components/admin/PanelAdmin.tsx";

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/admin" element={<PanelAdmin />} />


      </Routes>
      <Footer/>
    </>
  )
}

export default App
