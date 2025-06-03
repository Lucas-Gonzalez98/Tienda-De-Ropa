import { useState, useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import Producto from "../../models/Producto";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReusableTable } from "../Tabla";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";
import "../../styles/GrillaProductos.css"; // Importar estilos específicos
// ...existing code...
function GrillaProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal de "Ver"
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductoService.getAll();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const darDeAlta = async (id: number) => {
    if (!window.confirm("¿Seguro que desea dar de alta este producto?")) return;
    try {
      await ProductoService.changeEliminado(id);
      cargarProductos();
      alert("Producto dado de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta el producto");
    }
  }

  const eliminarProducto = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar este producto?")) return;
    try {
      await ProductoService.delete(id);
      cargarProductos();
      alert("Producto eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el producto");
    }
  };

  const handleActualizar = (prod: Producto) => {
    window.location.href = `/fromproducto?id=${prod.id}`;
  };

  const handleVer = (prod: Producto) => {
    setProductoSeleccionado(prod);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  // Definición de columnas para la tabla reusable
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { 
      key: "precio", 
      label: "Precio",
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: "eliminado",
      label: "Estado",
      render: (value: boolean) => (value ? "Eliminado" : "Activo"),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: Producto) => (
        <div className="d-flex justify-content-center">
          <BotonVer 
            onClick={() => handleVer(row)}
          />
          <BotonModificar
            onClick={() => handleActualizar(row)}
          />
          {!row.eliminado ? (  
            <BotonEliminar
              onClick={() => eliminarProducto(row.id!)}
            />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id!)}/>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Produtos</h2>
        <Button variant="outline-dark" onClick={() => window.location.href = "/fromProducto"}>
          Nueva Produto
        </Button>
      </div>
      <ReusableTable columns={columns} data={productos} />
      {/* Modal para ver información */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoSeleccionado && (
            <div>
              <p><b>Nombre:</b> {productoSeleccionado.nombre}</p>
              <p><b>Descripción:</b> {productoSeleccionado.descripcion}</p>
              <p><b>Precio:</b> ${productoSeleccionado.precio.toFixed(2)}</p>
              <p><b>Estado:</b> {productoSeleccionado.eliminado ? "Eliminado" : "Activo"}</p>
              {productoSeleccionado.imagenes && productoSeleccionado.imagenes.length > 0 && (
                <img
                  src={productoSeleccionado.imagenes[0].denominacion}
                  alt={productoSeleccionado.nombre}
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginTop: 10 }}
                />
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
// ...existing code...

export default GrillaProductos;