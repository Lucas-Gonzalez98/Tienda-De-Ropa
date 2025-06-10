import React, { useState, useEffect } from 'react';
import Stock from '../../models/Stock';
import Producto from '../../models/Producto';
import Color from '../../models/Color';
import Talle from '../../models/Talle';
import StockService from '../../services/StockService'; // Corrección de nombre
import { Modal, Button, Form, Alert, Spinner, Table } from 'react-bootstrap';
import ProductoService from '../../services/ProductoService';
import ColorService from '../../services/ColorService';
import TallesService from '../../services/TallesService';

interface FormData {
  productoId: number;
  colorId: number;
  talleId: number;
  cantidad: number;
  precioCompra: number;
}

const GrillaStock: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [colores, setColores] = useState<Color[]>([]);
  const [talles, setTalles] = useState<Talle[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'crear' | 'agregar' | 'actualizar'>('crear');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState<FormData>({
    productoId: 0,
    colorId: 0,
    talleId: 0,
    cantidad: 0,
    precioCompra: 0,
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [stocksData, productosData, coloresData, tallesData] = await Promise.all([
        StockService.getAll(),
        ProductoService.getAll(),
        ColorService.getAll(),
        TallesService.getAll()
      ]);
      setStocks(stocksData);
      setProductos(productosData);
      setColores(coloresData);
      setTalles(tallesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setErrors(['Error al cargar los datos']);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = async (tipo: 'crear' | 'agregar' | 'actualizar', stock?: Stock) => {
    setModalType(tipo);
    setSelectedStock(stock || null);
    setErrors([]);

    const cantidadInicial = tipo === 'actualizar' && stock ? stock.cantidad : 0;

    if (stock) {
      try {
        const productoId = stock.producto?.id ?? 0;
        const [precioCompra] = await Promise.all([
          StockService.getUltimoPrecioCompra(productoId).then(p => p ?? 0),
        ]);

        setFormData({
          productoId: stock.producto?.id || 0,
          colorId: stock.color?.id || 0,
          talleId: stock.talle?.id || 0,
          cantidad: cantidadInicial,
          precioCompra: precioCompra,
        });
      } catch (error) {
        console.error('Error cargando precios:', error);
        setFormData({
          productoId: stock.producto?.id || 0,
          colorId: stock.color?.id || 0,
          talleId: stock.talle?.id || 0,
          cantidad: cantidadInicial,
          precioCompra: 0,
        });
      }
    } else {
      setFormData({
        productoId: 0,
        colorId: 0,
        talleId: 0,
        cantidad: 0,
        precioCompra: 0,
      });
    }

    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setFormData({
      productoId: 0,
      colorId: 0,
      talleId: 0,
      cantidad: 0,
      precioCompra: 0,
    });
    setErrors([]);
  };

  const validarFormulario = (): boolean => {
    const errores: string[] = [];

    if (!formData.productoId) errores.push('Debe seleccionar un producto');
    if (!formData.colorId) errores.push('Debe seleccionar un color');
    if (!formData.talleId) errores.push('Debe seleccionar un talle');
    if (formData.cantidad <= 0) errores.push('La cantidad debe ser mayor a 0');
    if (formData.precioCompra <= 0) errores.push('El precio de compra debe ser mayor a 0');

    setErrors(errores);
    return errores.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    setErrors([]);
    try {
      if (modalType === 'crear') {
        await StockService.crearStock(
          formData.productoId,
          formData.colorId,
          formData.talleId,
          formData.cantidad,
          formData.precioCompra
        );
      } else if (modalType === 'agregar') {
        await StockService.agregarStock(
          formData.productoId,
          formData.colorId,
          formData.talleId,
          formData.cantidad,
          formData.precioCompra
        );
      } else if (modalType === 'actualizar' && selectedStock) {
        await StockService.actualizarStock(
          selectedStock.id,
          formData.productoId,
          formData.colorId,
          formData.talleId,
          formData.cantidad,
          formData.precioCompra
        );
      }

      await cargarDatos();
      cerrarModal();
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error al procesar la solicitud';
      setErrors([mensaje]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerTituloModal = (): string => {
    switch (modalType) {
      case 'crear': return 'Crear Nuevo Stock';
      case 'agregar': return 'Agregar Stock';
      case 'actualizar': return 'Actualizar Stock';
      default: return 'Stock';
    }
  };

  return (
    <>
      <h2>Gestión de Stock</h2>

      {loading && <div className="text-center mb-3"><Spinner animation="border" /></div>}

      {errors.length > 0 && (
        <Alert variant="danger">
          <ul className="mb-0">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </Alert>
      )}

      <Button variant="success" className="mb-3" onClick={() => abrirModal('crear')}>Crear Stock</Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Color</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stocks.length === 0 ? (
            <tr><td colSpan={5} className="text-center">No hay stock disponible.</td></tr>
          ) : stocks.map(stock => (
            <tr key={stock.id}>
              <td>{stock.producto.nombre}</td>
              <td>{stock.color.nombre}</td>
              <td>{stock.talle.nombre}</td>
              <td>{stock.cantidad}</td>
              <td>
                <Button variant="primary" size="sm" className="me-2" onClick={() => abrirModal('agregar', stock)}>Agregar</Button>
                <Button variant="warning" size="sm" onClick={() => abrirModal('actualizar', stock)}>Actualizar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={cerrarModal} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{obtenerTituloModal()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={manejarSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Producto</Form.Label>
              <Form.Select name="productoId" value={formData.productoId} onChange={handleChange} disabled={modalType !== 'crear'}>
                <option value={0}>Seleccione un producto</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Select name="colorId" value={formData.colorId} onChange={handleChange} disabled={modalType === 'actualizar'}>
                <option value={0}>Seleccione un color</option>
                {colores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Talle</Form.Label>
              <Form.Select name="talleId" value={formData.talleId} onChange={handleChange} disabled={modalType === 'actualizar'}>
                <option value={0}>Seleccione un talle</option>
                {talles.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} min={1} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio Compra</Form.Label>
              <Form.Control type="number" name="precioCompra" value={formData.precioCompra} onChange={handleChange} step="0.01" />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={cerrarModal} className="me-2">Cancelar</Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GrillaStock;
