import { useEffect, useState } from "react"
import type Stock from "../../models/Stock"
import StockService from "../../services/StockService";
import BotonAlta from "../layout/BotonAlta";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonVer from "../layout/BotonVer";
import ReusableTable from "../../components/Tabla/reusable-table"; // o el path correcto
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";

export function GrillaStock(){
  const [stockTotal, setStockTotal ] = useState<Stock[]>([])
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [StockSeleccionado, setStockSeleccionado] = useState<Stock | null>(null);

  const cargarStock = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StockService.getAll();
      setStockTotal(data);
    } catch (err) {
      setError("Error al cargar los stocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      cargarStock()
  }, []);

  const darDeAlta = async (id: number) => {
    if (!window.confirm("¿Seguro que desea dar de alta este Stock?")) return;
    try {
      await StockService.changeEliminado(id);
      cargarStock();
      alert("Stock dado de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta el sotck");
    }
  }
  
  const eliminarStock = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar este stock?")) return;
    try {
      await StockService.delete(id);
      cargarStock();
      alert("Stock eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el Stock");
    }
  };
  
  const handleActualizar = (prod: Stock) => {
    window.location.href = `/fromStock?id=${prod.id}`;
  };
  
  const handleVer = async (prod: Stock) => {
    setStockSeleccionado(prod);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStockSeleccionado(null);
  };

  // Definición de columnas para la tabla reusable
  const columns = [
    {
      key: "Stock",
      label: "Stock",
      render: (_: any, row: Stock) => row.producto?.nombre ?? "Sin nombre",
    },
    {
      key: "talle",
      label: "Talle",
      render: (_: any, row: Stock) => row.talle?.nombre ?? "Sin talle",
    },
    {
      key: "color",
      label: "Color",
      render: (_: any, row: Stock) => row.color?.nombre ?? "Sin color",
    },
    { key: "cantidad", label: "Cantidad" },
    {
      key: "eliminado",
      label: "Estado",
      render: (value: boolean) => (value ? "Eliminado" : "Activo"),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: Stock) => (
        <div className="d-flex justify-content-center">
          <BotonVer onClick={() => handleVer(row)} />
          <BotonModificar onClick={() => handleActualizar(row)} />
          {!row.eliminado ? (
            <BotonEliminar onClick={() => eliminarStock(row.id)} />
          ) : (
            <BotonAlta onClick={() => darDeAlta(row.id)} />
          )}
        </div>
      ),
    },
  ];



return (
  <div className="container mt-4">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <h2 className="mb-3">Listado de Stock</h2>
      <Button variant="outline-dark" onClick={() => window.location.href = "/fromStock"}>
          Agregar Stock
      </Button>
    </div>
    <ReusableTable
      columns={columns}
      data={stockTotal}
      striped
      hover
      responsive
      emptyMessage="No hay stock cargado."
    />
    {/* Modal para ver información */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {StockSeleccionado && (
            <div>
              <p><b>Producto:</b> {StockSeleccionado.producto.nombre}</p>
              <p><b>Cantidad:</b> {StockSeleccionado.cantidad}</p>
              <p><b>Color:</b> {StockSeleccionado.color.nombre}</p>
              <p><b>Talle:</b> {StockSeleccionado.talle.nombre}</p>
              <p><b>Estado:</b> {StockSeleccionado.eliminado ? "Eliminado" : "Activo"}</p>
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