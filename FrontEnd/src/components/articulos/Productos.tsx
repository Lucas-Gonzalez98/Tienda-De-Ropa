import { useState, useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import type Producto from "../../models/Producto";

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productos.map((producto) => (
                        <div key={producto.id} className="card">
                            <img 
                                src={producto.imagenes[0]?.denominacion || "/placeholder.png"} 
                                alt={producto.nombre || "Producto sin imagen"} 
                                className="w-full h-48 object-cover rounded-t-lg" 
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{producto.nombre}</h2>
                                <p className="text-gray-600">{producto.descripcion}</p>
                                <p className="text-xl font-bold">${producto.precio.toFixed(2)}</p>
                            </div>
                            <div className="p-4">
                                <button 
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => alert(`Producto ${producto.nombre} seleccionado`)}
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay productos disponibles.</p>
            )}
        </>
    )
}

export  default  Productos;