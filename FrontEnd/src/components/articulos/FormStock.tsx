import { useEffect, useState } from "react"
import Talle from "../../models/Talle"
import Producto from "../../models/Producto"
import Color from "../../models/Color"
import TalleService from "../../services/TallesService"
import ColorService from "../../services/ColorService"
import ProductoService from "../../services/ProductoService"
import { Button } from "react-bootstrap"
import StockService from "../../services/StockService"
//import Stock from "../../models/Stock"
import { useSearchParams } from "react-router-dom"


export function FormStock(){
    const [ talles, setTalles ] = useState<Talle[]>([])
    const [ talle, setTalle ] = useState<number | "">()
    const [ colores, setColores ] = useState<Color[]>([])
    const [ color, setColor ] = useState<number | "">()
    const [ productos, setProductos ] = useState<Producto[]>([])
    const [ producto, setProducto ] = useState<number | "">(0)
    const [ cantidad, setCantidad ] = useState<number>(0)
    const [searchParams] = useSearchParams();
    const [precioCompra, setPrecioCompra] = useState<number>(0);
    const idFromUrl = searchParams.get("id");

    const cargarTalles = () =>{
        TalleService.getAll().then((talles)=>setTalles(talles))
    }
    const cargarColores = () =>{
        ColorService.getAll().then((colores)=>setColores(colores))
    } 
    const cargarProductos = () =>{
        ProductoService.getAll().then((productos)=>setProductos(productos))
    } 
    useEffect(()=>{
        cargarTalles()
        cargarColores()
        cargarProductos()
    },[]);

    useEffect(()=>{
        if (idFromUrl) {
        StockService.getById(Number(idFromUrl)).then((sto) => {
            setCantidad(sto.cantidad);
            sto.producto.id && setProducto(sto.producto.id);
            setTalle(sto.talle.id);
            setColor(sto.color.id);
        });
    }
    },[idFromUrl]);

    const Guardar = async () => {
        try {
            if (!producto || !color || !talle || cantidad <= 0 || precioCompra <= 0) {
                alert("Por favor complete todos los campos correctamente");
                return;
            }

            await StockService.crearOActualizarStock({
                idProducto: producto as number,
                idColor: color as number,
                idTalle: talle as number,
                cantidad: cantidad,
                precioCompra: precioCompra
            });

            alert("Stock procesado exitosamente");
            window.location.href = "/admin";
        } catch (error) {
            console.error(error);
            alert("Error al procesar el stock");
        }
    };


    return(
        <>
            <h2 className="mt-5">Gestionar Stock</h2>
            <form className="formContainer container d-flex flex-column text-start" onSubmit={e => e.preventDefault()}>
                <div>
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        value={cantidad}
                        onChange={e => setCantidad(Number(e.target.value))}
                        min={0}
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label>Producto</label>
                    <select
                        value={producto}
                        onChange={e => setProducto(e.target.value ? Number(e.target.value) : "")}
                        >
                        <option value="">Elija una opcion</option>
                        {productos
                        .map(prod => (
                            <option key={prod.id} value={prod.id}>
                            {prod.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Talle</label>
                    <select
                        value={talle}
                        onChange={e => setTalle(e.target.value ? Number(e.target.value) : "")}
                        >
                        <option value="">Elija una opcion</option>
                        {talles
                        .map(talle => (
                            <option key={talle.id} value={talle.id}>
                            {talle.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Color</label>
                    <select
                        value={color}
                        onChange={e => setColor(e.target.value ? Number(e.target.value) : "")}
                        >
                        <option value="">Elija una opcion</option>
                        {colores
                        .map(color => (
                            <option key={color.id} value={color.id}>
                            {color.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Precio de Compra:</label>
                    <input
                        type="number"
                        value={precioCompra}
                        onChange={e => setPrecioCompra(Number(e.target.value))}
                        min={0}
                        step="0.01"
                        required
                    />
                </div>
                <Button
                    variant="success"
                    className="mt-3"
                    onClick={Guardar}
                    disabled={cantidad <= 0 || producto === "" || talle === "" || color === "" || precioCompra <= 0}
                >
                    {idFromUrl ? "Actualizar" : "Agregar"}
                </Button>
            </form>
        </>
    )
}