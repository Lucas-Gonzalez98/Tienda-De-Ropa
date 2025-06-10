import { useState, useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import type Producto from "../../models/Producto";
import CardProducto from "./CardProducto";
import { Form, Row, Col, Button } from "react-bootstrap";

function Productos() {
    const [productosOriginales, setProductosOriginales] = useState<Producto[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);

    const [filtroTexto, setFiltroTexto] = useState<string>("");
    const [filtroCategoria, setFiltroCategoria] = useState<string>("");

    const [filtroPrecioDesde, setFiltroPrecioDesde] = useState<string>("");
    const [filtroPrecioHasta, setFiltroPrecioHasta] = useState<string>("");

    // Para el filtro de categorías, extraemos todas las categorías únicas:
    const categoriasUnicas = Array.from(
      new Set(
        productosOriginales.flatMap(p => p.categorias.map(c => c.denominacion))
      )
    );

    useEffect(() => {
        ProductoService.getNotDeleted()
            .then((data) => {
                setProductosOriginales(data);
                setProductos(data);
            })
            .catch(console.error);
    }, []);

    const aplicarFiltros = () => {
        let filtrados = [...productosOriginales];

        if (filtroTexto) {
            const txt = filtroTexto.toLowerCase();
            filtrados = filtrados.filter(p => {
                const texto = (p.nombre).toLowerCase();
                const palabras = texto.split(/\s+/);
                return palabras.some(palabra => palabra.startsWith(txt));
            });
        }

        // filtro por categoría (nombre)
        if (filtroCategoria) {
            filtrados = filtrados.filter(p =>
                p.categorias.some(c => c.denominacion === filtroCategoria)
            );
        }

        // filtro por precio desde
        if (filtroPrecioDesde !== "") {
            const desde = parseFloat(filtroPrecioDesde);
            console.log(filtrados)
            filtrados = filtrados.filter(p => (p.precio ?? 0) >= desde);
        }

        // filtro por precio hasta
        if (filtroPrecioHasta !== "") {
            const hasta = parseFloat(filtroPrecioHasta);
            filtrados = filtrados.filter(p => (p.precio ?? 0) <= hasta);
        }

        setProductos(filtrados);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [filtroTexto, filtroCategoria, filtroPrecioDesde, filtroPrecioHasta, productosOriginales]);

    const limpiarFiltros = () => {
        setFiltroTexto("");
        setFiltroCategoria("");
        setFiltroPrecioDesde("");
        setFiltroPrecioHasta("");
    };

    return (
        <div className="productos-container mt-4">
            <h1>Productos</h1>
            <Form className="d-flex flex-wrap justify-content-center">
                <Row>
                    <Col md={3}>
                        <Form.Control
                            placeholder="Buscar por nombre o descripción"
                            value={filtroTexto}
                            onChange={(e) => setFiltroTexto(e.target.value)}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Select
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categoriasUnicas.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="number"
                            placeholder="Precio desde"
                            value={filtroPrecioDesde}
                            onChange={(e) => setFiltroPrecioDesde(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="number"
                            placeholder="Precio hasta"
                            value={filtroPrecioHasta}
                            onChange={(e) => setFiltroPrecioHasta(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-secondary" onClick={limpiarFiltros}>
                            <i className="fas fa-eraser me-1"></i> Limpiar Filtros
                        </Button>
                    </Col>
                </Row>
            </Form>
            {productos.length > 0 ? (
                <div className="d-flex flex-wrap justify-content-center" style={{ gap: "1rem", padding: "1rem 5rem" }}>
                    {productos.map((producto) => (
                        <CardProducto key={producto.id} producto={producto} />
                    ))}
                </div>
            ) : (
                <p>No hay productos disponibles.</p>
            )}
        </div>
    );
}

export default Productos;
