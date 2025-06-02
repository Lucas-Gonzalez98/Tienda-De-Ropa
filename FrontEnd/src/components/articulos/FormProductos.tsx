import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import { Button } from "react-bootstrap";
import type Producto from "../../models/Producto";
import type ImagenProducto from "../../models/ImagenProducto";

function FormProducto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState<number>(0);
    const [eliminado, setEliminado] = useState(false);
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get("id");
    const [imagenesExistentes, setImagenesExistentes] = useState<ImagenProducto[]>([]);
    const [imagenes, setImagenes] = useState<File[]>([]);

    useEffect(() => {
        if (idFromUrl) {
            ProductoService.getById(Number(idFromUrl))
                .then((producto: Producto) => {
                    setNombre(producto.nombre);
                    setDescripcion(producto.descripcion);
                    setPrecio(producto.precio);
                    setEliminado(!!producto.eliminado);
                    setImagenesExistentes(producto.imagenes || []);
                });
        }
    }, [idFromUrl]);

    // Maneja la selección de imágenes nuevas, evitando duplicados con existentes y entre sí
    const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const nuevosArchivos = Array.from(e.target.files as FileList);

            // Nombres de imágenes existentes (tanto en backend como en nuevas seleccionadas)
            const nombresExistentes = [
                ...imagenesExistentes.filter(img => !img.eliminado).map(img => img.denominacion.split("/").pop()),
                ...imagenes.map(img => img.name)
            ];

            // Filtra para evitar duplicados por nombre
            const archivosFiltrados = nuevosArchivos.filter(nuevo =>
                !nombresExistentes.includes(nuevo.name)
            );

            if (archivosFiltrados.length < nuevosArchivos.length) {
                alert("Algunas imágenes ya existen y no se agregarán de nuevo.");
            }

            setImagenes(prev => [...prev, ...archivosFiltrados]);
        }
    };

    // Elimina una imagen existente (marca como eliminada)
    const eliminarImagenExistente = (idx: number) => {
        setImagenesExistentes(prev =>
            prev.map((img, i) => (i === idx ? { ...img, eliminado: true } : img))
        );
    };

    // Elimina una imagen nueva (de la lista de archivos seleccionados)
    const eliminarImagenNueva = (idx: number) => {
        setImagenes(prev => prev.filter((_, i) => i !== idx));
    };

    const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const Guardar = async () => {
    // Convierte las imágenes nuevas a base64
    const imagenesNuevasBase64 = await Promise.all(
        imagenes.map(async (file) => ({
            denominacion: await fileToBase64(file)
        }))
    );

    // Solo envía las imágenes existentes que no estén marcadas como eliminadas
    const imagenesFinales = [
        ...imagenesExistentes.filter(img => !img.eliminado).map(img => ({ id: img.id, denominacion: img.denominacion })),
        ...imagenesNuevasBase64
    ];

    const producto: any = {
        id: idFromUrl ? Number(idFromUrl) : undefined,
        nombre,
        descripcion,
        precio,
        eliminado,
        imagenes: imagenesFinales
    };

    try {
        if (idFromUrl) {
            await ProductoService.update(Number(idFromUrl), producto);
        } else {
            await ProductoService.create(producto);
        }
        alert("Producto guardado exitosamente");
        window.location.href = "/productos";
    } catch (error) {
        console.error("Error al guardar el producto:", error);
        alert("Error al guardar el producto");
    }
};
    return (
        <>
            <h2 className="mt-5">{idFromUrl ? "Actualizar" : "Crear"} Producto</h2>
            <form className="formContainer container d-flex flex-column gap-3 text-start" onSubmit={e => e.preventDefault()}>
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
                                    <div key={img.id || idx} style={{ position: "relative", display: "inline-block" }}>
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