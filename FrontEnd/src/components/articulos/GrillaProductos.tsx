// GrillaProductos.tsx (completa, mejorada)

import { useState, useEffect, type JSX } from "react";
import Producto from "../../models/Producto";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import HistoricoPrecioventaService from "../../services/HistoricoPrecioVentaService";
import HistoricoPrecioCompraService from "../../services/HistoricoPrecioCompraService";
import StockService from "../../services/StockService";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";
import { ReusableTable } from "../Tabla";
import "../../styles/GrillaProductos.css";

type ProductoConPrecio = Producto & { precioHistorico?: number | null };

const GrillaProductos = () => {
  const [productos, setProductos] = useState<ProductoConPrecio[]>([]);
  const [filtered, setFiltered] = useState<ProductoConPrecio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stock, setStock] = useState<any[]>([]);
  const [historicoVenta, setHistoricoVenta] = useState<any[]>([]);
  const [historicoCompra, setHistoricoCompra] = useState<any[]>([]);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");
  const [tipoFiltroPrecio, setTipoFiltroPrecio] = useState("mayor");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);

  useEffect(() => {
    cargarProductos();
    CategoriaService.getAllTree().then(setCategorias);
  }, []);

  useEffect(() => {
    filtrar();
  }, [productos, filtroNombre, filtroPrecio, tipoFiltroPrecio, filtroEstado, filtroCategoria]);

  const cargarProductos = async () => {
    const data = await ProductoService.getAll();
    const productosConPrecios = await Promise.all(
      data.map(async (prod) => {
        try {
          const historico = await HistoricoPrecioventaService.ultimoById(prod.id!);
          return { ...prod, precioHistorico: historico.precio };
        } catch {
          return { ...prod, precioHistorico: null };
        }
      })
    );
    setProductos(productosConPrecios);
  };

  const filtrar = () => {
    let filtrados = [...productos];
    if (filtroNombre)
      filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));
    if (filtroPrecio) {
      const precioNum = parseFloat(filtroPrecio);
      filtrados = filtrados.filter(p => tipoFiltroPrecio === "mayor"
        ? (p.precioHistorico || 0) >= precioNum
        : (p.precioHistorico || 0) <= precioNum);
    }
    if (filtroEstado !== "")
      filtrados = filtrados.filter(p => (filtroEstado === "activo" ? !p.eliminado : p.eliminado));
    if (filtroCategoria)
      filtrados = filtrados.filter(p => p.categorias?.some(c => c.id === filtroCategoria));

    setFiltered(filtrados);
  };

  const handleVer = async (prod: Producto) => {
    setProductoSeleccionado(prod);
    setShowModal(true);
    const [stock, venta, compra] = await Promise.all([
      StockService.getByProducto(prod.id!),
      HistoricoPrecioventaService.getUltimosById(prod.id!, 3),
      HistoricoPrecioCompraService.getUltimosById(prod.id!, 3),
    ]);
    setStock(stock);
    setHistoricoVenta(venta);
    setHistoricoCompra(compra);
  };

  const handleActualizar = (p: Producto) => window.location.href = `/fromproducto?id=${p.id}`;
  const eliminarProducto = async (id: number) => {
    if (confirm("¿Eliminar producto?")) {
      await ProductoService.delete(id);
      cargarProductos();
    }
  };
  const darDeAlta = async (id: number) => {
    if (confirm("¿Dar de alta el producto?")) {
      await ProductoService.changeEliminado(id);
      cargarProductos();
    }
  };

  const renderCategorias = (cats: Categoria[], nivel = 0): JSX.Element[] => {
    return cats.flatMap(cat => [
      <option key={cat.id} value={cat.id}>
        {"--".repeat(nivel)} {cat.denominacion}
      </option>,
      ...(cat.subcategorias ? renderCategorias(cat.subcategorias, nivel + 1) : [])
    ]);
  };

  const columns = [
    {
      key: "imagen",
      label: "Img",
      render: (_: any, row: ProductoConPrecio) =>
        row.imagenes?.length ? <img src={row.imagenes[0].denominacion} style={{ width: 50 }} /> : null
    },
    { key: "nombre", label: "Nombre" },
    {
      key: "precio", label: "Precio",
      render: (_: any, row: ProductoConPrecio) => row.precioHistorico ? `$${row.precioHistorico.toFixed(2)}` : "-"
    },
    {
      key: "estado",
      label: "Estado",
      render: (_: any, row: Producto) => row.eliminado ? "Eliminado" : "Activo"
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (_: any, row: Producto) => (
        <div className="d-flex gap-1 justify-content-center">
          <BotonVer onClick={() => handleVer(row)} />
          <BotonModificar onClick={() => handleActualizar(row)} />
          {!row.eliminado
            ? <BotonEliminar onClick={() => eliminarProducto(row.id!)} />
            : <BotonAlta onClick={() => darDeAlta(row.id!)} />}
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Productos</h2>
        <Button variant="outline-dark" onClick={() => window.location.href = "/fromproducto"}>
          Nuevo Producto
        </Button>
      </div>
      <Form className="mb-3">
        <div className="row g-2">
          <div className="col-md">
            <Form.Control placeholder="Buscar por nombre" value={filtroNombre} onChange={e => setFiltroNombre(e.target.value)} />
          </div>
          <div className="col-md">
            <div className="d-flex">
              <Form.Select value={tipoFiltroPrecio} onChange={e => setTipoFiltroPrecio(e.target.value)} className="me-1">
                <option value="mayor">Mayor que</option>
                <option value="menor">Menor que</option>
              </Form.Select>
              <Form.Control type="number" placeholder="Precio" value={filtroPrecio} onChange={e => setFiltroPrecio(e.target.value)} />
            </div>
          </div>
          <div className="col-md">
            <Form.Select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="eliminado">Eliminado</option>
            </Form.Select>
          </div>
          <div className="col-md">
            <Form.Select value={filtroCategoria ?? ""} onChange={e => setFiltroCategoria(+e.target.value)}>
              <option value="">Todas las categorías</option>
              {renderCategorias(categorias)}
            </Form.Select>
          </div>
        </div>
      </Form>
      <ReusableTable columns={columns} data={filtered} />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoSeleccionado && (
            <>
              <h5>{productoSeleccionado.nombre}</h5>
              <p>{productoSeleccionado.descripcion}</p>
              <h6>Stock</h6>
              <Table size="sm" striped>
                <thead><tr><th>Talle</th><th>Color</th><th>Cantidad</th></tr></thead>
                <tbody>
                  {stock.map((s, i) => (
                    <tr key={i}><td>{s.talle.nombre}</td><td>{s.color.nombre}</td><td>{s.cantidad}</td></tr>
                  ))}
                </tbody>
              </Table>
              <h6>Histórico de venta</h6>
              {historicoVenta.length > 0 ? (
                <Table size="sm" striped>
                  <thead><tr><th>Fecha</th><th>Precio</th></tr></thead>
                  <tbody>{historicoVenta.map((h, i) => (
                    <tr key={i}><td>{h.fecha}</td><td>${h.precio}</td></tr>
                  ))}</tbody>
                </Table>
              ) : <p>Aún no tiene históricos de venta.</p>}

              <h6>Histórico de compra</h6>
              {historicoCompra.length > 0 ? (
                <Table size="sm" striped>
                  <thead><tr><th>Fecha</th><th>Precio</th></tr></thead>
                  <tbody>{historicoCompra.map((h, i) => (
                    <tr key={i}><td>{h.fecha}</td><td>${h.precio}</td></tr>
                  ))}</tbody>
                </Table>
              ) : <p>Aún no tiene históricos de compra.</p>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrillaProductos;
