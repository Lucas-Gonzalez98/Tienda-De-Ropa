import { useState, useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import type Producto from "../../models/Producto";
import CardProducto from "./CardProducto";

function Productos(){
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        ProductoService.getNotDeleted().then(setProductos).catch(console.error);
    }, []);

    return (
        <>
            <h1>Productos</h1>
            <p>Esta es la página de productos.</p>
            { productos.length > 0 ? (
                <div className="d-flex flex-wrap" style={{ gap: "1rem", padding: "1rem 5rem" }}>
                    {productos.map((producto) => (
                        <CardProducto articulo={producto}/>
                    ))}
                </div>
            ) : (
                <p>No hay productos disponibles.</p>
            )}
        </>
    )
}

export  default  Productos;