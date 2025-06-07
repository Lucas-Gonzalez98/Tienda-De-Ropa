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


export function FormStock(){
    const [ talles, setTalles ] = useState<Talle[]>([])
    const [ talle, setTalle ] = useState<number | "">()
    const [ colores, setColores ] = useState<Color[]>([])
    const [ color, setColor ] = useState<number | "">()
    const [ productos, setProductos ] = useState<Producto[]>([])
    const [ producto, setProducto ] = useState<number | "">(0)
    const [ cantidad, setCantidad ] = useState<number>(0)

    useEffect(()=>{
        TalleService.getAll().then((talles)=>setTalles(talles))
        ColorService.getAll().then((colores)=>setColores(colores))
        ProductoService.getAll().then((productos)=>setProductos(productos))
    }),[];

    const Guardar = async () =>{
        const stock = new Stock()
        stock.cantidad = cantidad
        stock.talle = { id: talle } as Talle 
        stock.color = { id: color } as Color 
        stock.producto = { id: producto }  as Producto
        StockService.create(stock);
        alert("Stock agregado exitosamente");
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
                    disabled={cantidad <= 0}
                >
                    Agregar
                </Button>
            </form>
        </>
    )
}