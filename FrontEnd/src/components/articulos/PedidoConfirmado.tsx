import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../hooks/useCarrito";
import Domicilio from "../../models/Domicilio";
import { Button, Card, Col } from "react-bootstrap";
import ClienteService from "../../services/ClienteService";
import { Row } from "react-bootstrap";
import {  FaPlus } from "react-icons/fa";
import ModalDomicilio from "../cliente/ModalDomicilio";
import '../../styles/PedidoConfirmado.css'
import CheckoutMP from "./CheckoutMP";
import type Pedido from "../../models/Pedido";

export function PedidoConfirmado(){
    const carritoCtx = useCarrito();
    const { userData } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<any | null>(null);
    const [ domicilios, setDomicilios ] = useState<Domicilio[]>([])
    const [ total, setTotal ] = useState(0)
    const [pedidoGuardado, setPedidoGuardado] = useState<Pedido | null>(null);

    if (!carritoCtx) return null;
    const {
        pedido,
        guardarPedidoYObtener
    } = carritoCtx;
    const handlePagarConMP = async () => {
        const pedidoFinal = await guardarPedidoYObtener();
        if (pedidoFinal) {
        setPedidoGuardado(pedidoFinal);
        }
    };
    useEffect(()=>{
        if(userData?.id){
            const domiciliosCliente = () => {ClienteService.getClienteById(userData.id as number).then((cliente) => setDomicilios(cliente.domicilios))}
            domiciliosCliente();
        }
        if (carritoCtx){
            let totalPedido = 0
            pedido.detalles.map((det)=>(
                totalPedido += det.precio * det.cantidad
            ))
            setTotal(totalPedido)
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
    return(
        <>
            <div className="confirmarPedido d-flex" style={{margin: "50px auto", justifyContent: "space-around"}}>
                <div className="domicilios">
                    {domicilios.map((domicilio, index)=>(
                        <label key={index} className={`radio-card ${direccionSeleccionada === domicilio ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="domicilio"
                                value={domicilio.id}
                                checked={direccionSeleccionada === domicilio}
                                onChange={() => setDireccionSeleccionada(domicilio)}
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
                    <div className="d-flex justify-content-start mb-4">
                        <Button variant="dark" onClick={handleAgregar}>
                            <FaPlus className="me-2" />
                            Agregar dirección
                        </Button>
                    </div>
                    <ModalDomicilio
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        onSubmit={handleGuardar}
                        direccionActual={direccionSeleccionada}
                    />
                </div>
                <div className="resumenPedido">
                    <div className="resumen p-3 mb-3" style={{ border: "1px solid gray", borderRadius: "10px" }}>
                        <h5>Resumen del pedido</h5>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <span>Productos:</span>
                            <span>{pedido.detalles.length} ítems</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>${total}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Envío:</span>
                            <span>$7500</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>${total + 7500}</span>
                        </div>
                    </div>
                    <Button variant="primary" onClick={handlePagarConMP}>
                        Pagar con Mercado Pago
                    </Button>
                    {pedidoGuardado && (
                        <CheckoutMP pedido={pedido}/>
                    )}
                </div>

            </div>
        </>
    )
}