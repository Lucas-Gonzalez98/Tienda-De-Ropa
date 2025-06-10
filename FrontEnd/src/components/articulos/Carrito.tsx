import { useEffect, useState } from "react";
import { Button, Card, Col, Image, Row } from "react-bootstrap";
import Pedido from "../../models/Pedido";
import { useCarrito } from "../../hooks/useCarrito";
import HistoricoPrecioventaService from "../../services/HistoricoPrecioVentaService";
import trashIcon from "../../assets/trash-xmark-svgrepo-com.svg";
import CheckoutMP from "./CheckoutMP";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ModalDomicilio from "../cliente/ModalDomicilio";
import type Domicilio from "../../models/Domicilio";
import { useAuth } from "../../context/AuthContext";
import ClienteService from "../../services/ClienteService";
import { Modal } from "react-bootstrap";

export function Carrito() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showModalDirecciones, setShowModalDirecciones] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<any | null>(null);
  const [ domicilios, setDomicilios ] = useState<Domicilio[]>([])
  const carritoCtx = useCarrito();
  const [pedidoGuardado, setPedidoGuardado] = useState<Pedido | null>(null);
  const [preciosActualizados, setPreciosActualizados] = useState<Record<number, number>>({});
  if (!carritoCtx) return null;
  useEffect(()=>{
        if(userData?.id){
            const domiciliosCliente = () => {ClienteService.getClienteById(userData.id as number).then((cliente) => setDomicilios(cliente.domicilios))}
            domiciliosCliente();
        }
  },[]);
  const handleGuardar = (nuevoDomicilio: any) => {
        if (!nuevoDomicilio) return;

        setDomicilios(prev => {
            const existe = prev.find(d => d.id === nuevoDomicilio.id);
            if (existe) {
                // Actualización
                return prev.map(d => d.id === nuevoDomicilio.id ? nuevoDomicilio : d);
            } else {
                // Nuevo domicilio
                return [...prev, nuevoDomicilio];
            }
        });

        setShowModal(false);
    };
    const handleAgregar = () => {
        setDireccionSeleccionada(null);
        setShowModal(true);
    };
  const {
    pedido,
    preferenceId,
    restarDelCarrito,
    agregarAlCarrito,
    quitarDelCarrito,
    limpiarCarrito,
    guardarPedidoYObtener
  } = carritoCtx;

  const carrito = pedido.detalles;
  useEffect(() => {
    const obtenerPrecios = async () => {
      const precios: Record<number, number> = {};
      for (const item of carrito) {
        try {
          if(item.stock.producto.id){
            const historico = await HistoricoPrecioventaService.ultimoById(item.stock.producto.id);
            precios[item.stock.producto.id] = historico.precio;
          }
        } catch {
          if(item.stock.producto.id){
            precios[item.stock.producto.id] = item.stock.producto.precio ?? 0; // fallback con default
          }
        }
      }
      setPreciosActualizados(precios);
    };

    if (carrito.length > 0) {
      obtenerPrecios();
    }
  }, [carrito]);
  const handlePagarConMP = async () => {
    const pedidoFinal = await guardarPedidoYObtener();
    if (pedidoFinal) {
      setPedidoGuardado(pedidoFinal);
    }
    console.log("preference: ",preferenceId)
  };
  useEffect(() => {
    if (pedidoGuardado && (preferenceId != "")) {
      navigate("/confirmado");
    }
  }, [pedidoGuardado, preferenceId]);
  const confirmarPedido = () =>{
    setShowModalDirecciones(true)
  }
  const seleccionarDireccion = (domicilio: Domicilio) => {
    setDireccionSeleccionada(domicilio);
    pedido.domicilio = domicilio;
  }
  return (
    <div className="m-auto container">
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          carrito.map((item) => (
            <div key={item.stock.id} className="row d-flex align-items-center mb-3 border-bottom pb-2">
              <Image
                src={item.stock.producto.imagenes[0]?.denominacion}
                alt={"Imagen del artículo"}
                style={{ width: "200px", height: "auto", objectFit: "cover", marginRight: "10px" }}
                rounded
                />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-2 pb-2">
                  <strong>{item.stock.producto.nombre}</strong>
                  <Button
                    style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}
                    variant="outline-danger"
                    size="sm"
                    onClick={() => quitarDelCarrito(item.stock.id ? item.stock.id : 0)}
                  >
                    <img src={trashIcon} alt="Eliminar" style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column align-items-start">
                    <small>
                      Talle: 
                      {item.stock.talle?.nombre}
                    </small>

                    <small>
                      Color: 
                      {item.stock.color?.nombre}
                    </small>
                    {item.stock.producto.id !== undefined &&
                      <small>
                        Precio: $
                        {preciosActualizados[item.stock.producto.id]?.toFixed(2) ?? "Cargando..."}
                      </small>
                    }
                  </div>
                  <div className="d-flex align-items-center mx-2">
                    <Button
                      style={{ background: "white", color: "black" }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => restarDelCarrito(item.stock.id ? item.stock.id : 0)}
                    >
                      <strong>-</strong>
                    </Button>
                    <span className="mx-2">{item.cantidad}</span>
                    <Button
                      style={{ background: "white", color: "black" }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => agregarAlCarrito(item.stock, 1)}
                    >
                      <strong>+</strong>
                    </Button>
                  </div>
                </div>
                {item.stock.producto.id !== undefined &&
                <div className="text-end">
                  Subtotal: $
                  {((preciosActualizados[item.stock.producto.id] ?? 0) * item.cantidad).toFixed(2)}
                </div>
                }
              </div>
            </div>
          ))
        )}
        {carrito.length > 0 && (
          <>
            <div className="mt-3 text-end">
              <strong>
                Total: $
                {carrito
                  .reduce((acc, item) => {
                    const id = item.stock.producto.id;
                    const precio = typeof id === "number" ? preciosActualizados[id] ?? 0 : 0;
                    return acc + precio * item.cantidad;
                  }, 0)
                  .toFixed(2)}
              </strong>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="warning" onClick={limpiarCarrito}>Limpiar carrito</Button>
              <Button variant="primary" onClick={confirmarPedido}>
                  Confirmar Pedido
              </Button>
              {pedidoGuardado && 
                <CheckoutMP pedido={pedidoGuardado}/>
              }
            </div>
          <Modal show={showModalDirecciones} onHide={() => setShowModalDirecciones(false)} centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <div className="domicilios">
                      <h3>Seleccione la direccion de envio</h3>
                    {domicilios.map((domicilio, index)=>(
                        <label key={index} className={`radio-card ${direccionSeleccionada === domicilio ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="domicilio"
                                value={domicilio.id}
                                checked={direccionSeleccionada === domicilio}
                                onChange={() => seleccionarDireccion(domicilio)}
                                hidden
                            />
                        <Card key={domicilio.id} className="m-0 p-0">
                            <Card.Body>
                                <Row className="">
                                    <Col>
                                        <h5 className="mb-1 fw-semibold">{domicilio.referencia}</h5>
                                        <p className="mb-0">
                                            {domicilio.calle} {domicilio.numero} - CP {domicilio.codigoPostal}, {domicilio.localidad?.nombre}
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        </label>
                    ))}
                    <div className="d-flex justify-content-between">
                      <div className="d-flex justify-content-start mb-4">
                          <Button variant="dark" onClick={handleAgregar}>
                              <FaPlus className="me-2" />
                              Agregar dirección
                          </Button>
                      </div>
                      <div className="d-flex justify-content-start mb-4">
                          <Button variant="dark" onClick={handlePagarConMP}>
                              Confirmar dirección
                          </Button>
                      </div>
                    </div>
                    <ModalDomicilio
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        onSubmit={handleGuardar}
                        direccionActual={direccionSeleccionada}
                    />
            </div>
            </Modal.Body>
          </Modal>
          </>
        )}
    </div>
  );
}
