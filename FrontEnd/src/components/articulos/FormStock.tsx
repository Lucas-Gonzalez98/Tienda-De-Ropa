import { useEffect, useState } from "react"
import Talle from "../../models/Talle"
import Producto from "../../models/Producto"
import Color from "../../models/Color"
import TalleService from "../../services/TallesService"
import ColorService from "../../services/ColorService"
import ProductoService from "../../services/ProductoService"
import { Button } from "react-bootstrap"
import StockService from "../../services/StockService"
import Stock from "../../models/Stock"
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

    const Guardar = async () =>{
        const stockNuevo = new Stock()
        stockNuevo.cantidad = cantidad
        stockNuevo.talle = { id: talle } as Talle 
        stockNuevo.color = { id: color } as Color 
        stockNuevo.producto = { id: producto }  as Producto
        StockService.create(stockNuevo);
        if(idFromUrl){
            await StockService.update(Number(idFromUrl), stockNuevo);
            alert("Categoría actualizada correctamente");
        }else{
            const stockNuevo = new Stock()
            stockNuevo.cantidad = cantidad
            stockNuevo.talle = { id: talle } as Talle 
            stockNuevo.color = { id: color } as Color 
            stockNuevo.producto = { id: producto }  as Producto
            StockService.create(stockNuevo);
            alert("Stock agregado exitosamente");
        }
        window.location.href = "/admin";
    }

    return(
        <>
            <h2 className="mt-5">Agregar Stock</h2>
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
                <Button
                    variant="success"
                    className="mt-3"
                    onClick={Guardar}
                    disabled={cantidad <= 0 || producto === "" || talle === "" || color === ""}
                >
                    {idFromUrl ? "Actualizar" : "Agregar"}
                </Button>
            </form>
        </>
    )
}