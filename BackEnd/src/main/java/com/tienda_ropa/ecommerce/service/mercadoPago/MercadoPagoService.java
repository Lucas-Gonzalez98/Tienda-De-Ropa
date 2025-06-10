package com.tienda_ropa.ecommerce.service.mercadoPago;


import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.mercadopago.PreferenceMP;

public interface MercadoPagoService {

    PreferenceMP getPreferenciaIdMercadoPago(Pedido pedido);
}
