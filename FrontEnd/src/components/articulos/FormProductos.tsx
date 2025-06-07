import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import ImagenesnubeService from "../../services/ImagenesNubeService";
import { Button } from "react-bootstrap";
import type Producto from "../../models/Producto";
import type ImagenProducto from "../../models/ImagenProducto";
import "../../styles/FormProducto.css";
import HistoricoPrecioVenta from "../../models/HistoricoPrecioVenta";
import HistoricoPrecioventaService from "../../services/HistoricoPrecioVentaService";
import type Categoria from "../../models/Categoria";

function FormProducto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState<number>(0);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [precioHistorico, setPrecioHistorico] = useState<number>(0);
    const [eliminado, setEliminado] = useState(false);
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get("id");

    const [imagenesExistentes, setImagenesExistentes] = useState<ImagenProducto[]>([]);
    const [imagenes, setImagenes] = useState<File[]>([]);

    useEffect(() => {
        if (idFromUrl) {
            ProductoService.getById(Number(idFromUrl)).then((producto: Producto) => {
                setNombre(producto.nombre);
                setDescripcion(producto.descripcion);
                HistoricoPrecioventaService.ultimoById(Number(idFromUrl)).then((historico: HistoricoPrecioVenta) => {
                    setPrecio(historico.precio)
                    setPrecioHistorico(historico.precio)
                })
                setCategorias(producto.categorias);
                setEliminado(!!producto.eliminado);
                setImagenesExistentes(producto.imagenes || []);
            });
        }
    }, [idFromUrl]);

    const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const nuevosArchivos = Array.from(e.target.files as FileList);
            const nombresExistentes = [
                ...imagenesExistentes.filter(img => !img.eliminado).map(img => img.denominacion.split("/").pop()),
                ...imagenes.map(img => img.name)
            ];

            const archivosFiltrados = nuevosArchivos.filter(nuevo =>
                !nombresExistentes.includes(nuevo.name)
            );

            if (archivosFiltrados.length < nuevosArchivos.length) {
                alert("Algunas imágenes ya existen y no se agregarán de nuevo.");
            }

            setImagenes(prev => [...prev, ...archivosFiltrados]);
        }
    };

    const eliminarImagenExistente = (idx: number) => {
        setImagenesExistentes(prev =>
            prev.map((img, i) => (i === idx ? { ...img, eliminado: true } : img))
        );
    };

    const eliminarImagenNueva = (idx: number) => {
        setImagenes(prev => prev.filter((_, i) => i !== idx));
    };

    const Guardar = async () => {
        const nuevasImagenes = await Promise.all(
            imagenes.map(async (file) => {
                const imagenSubida = await ImagenesnubeService.subirImagen(file);
                return {
                    denominacion: imagenSubida.denominacion,
                    eliminado: false,
                };
            })
        );

        const imagenesFinales = [
            ...imagenesExistentes.filter(img => !img.eliminado).map(img => ({
                id: img.id,
                denominacion: img.denominacion,
            })),
            ...nuevasImagenes
        ];

        const producto: Producto = {
             ...(idFromUrl && { id: Number(idFromUrl) }), // solo si hay id
            nombre,
            descripcion,
            categorias,
            eliminado,
            imagenes: imagenesFinales
        };

        try {
            if (idFromUrl) {
                console.log("actualizando", producto)
                if(precio != precioHistorico){
                    const historico = new HistoricoPrecioVenta();
                    historico.fecha = new Date();
                    historico.precio = precio;
                    historico.producto = producto;
                    await HistoricoPrecioventaService.create(historico)
                }
                await ProductoService.update(Number(idFromUrl), producto);
            } else {
                console.log("creando", producto)
                await ProductoService.create(producto, precio);
            }
            alert("Producto guardado exitosamente");
            window.location.href = "/admin";
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            alert("Error al guardar el producto");
        }
    };

    return (
        <>
            <h2 className="mt-5">{idFromUrl ? "Actualizar" : "Crear"} Producto</h2>
            <form className="formContainer container d-flex flex-column text-start" onSubmit={e => e.preventDefault()}>
                <div>
                    <label>Nombre:</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} required />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={precio}
                        onChange={e => setPrecio(Number(e.target.value))}
                        min={0}
                        step="0.01"
                        required
                    />
                </div>

                {/* Imágenes */}
                <div>
                    <label>Imágenes:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagenesChange}
                    />

                    {/* Imágenes existentes */}
                    {imagenesExistentes.filter(img => !img.eliminado).length > 0 && (
                        <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
                            {imagenesExistentes.map((img, idx) =>
                                !img.eliminado && (
                                    <div key={img.id || idx} style={{ position: "relative", display: "inline-block", width: "fit-content" }}>
                                        <img
                                            src={img.denominacion}
                                            alt={`img-existente-${idx}`}
                                            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => eliminarImagenExistente(idx)}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* Imágenes nuevas */}
                    {imagenes.length > 0 && (
                        <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
                            {imagenes.map((img, idx) => (
                                <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`preview-${idx}`}
                                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => eliminarImagenNueva(idx)}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 20,
                                            height: 20,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label>Estado:</label>
                    <select
                        value={eliminado ? "eliminado" : "activo"}
                        onChange={e => setEliminado(e.target.value === "eliminado")}
                    >
                        <option value="activo">Activo</option>
                        <option value="eliminado">Eliminado</option>
                    </select>
                </div>

                <Button
                    variant="success"
                    className="mt-3"
                    onClick={Guardar}
                    disabled={!nombre || !descripcion || precio <= 0}
                >
                    {idFromUrl ? "Actualizar" : "Crear"}
                </Button>
            </form>
        </>
    );
}

export default FormProducto;
