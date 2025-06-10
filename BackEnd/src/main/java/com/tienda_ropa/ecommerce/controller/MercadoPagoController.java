package com.tienda_ropa.ecommerce.controller;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.merchantorder.MerchantOrderClient;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.merchantorder.MerchantOrder;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.mercadopago.PreferenceMP;
import com.tienda_ropa.ecommerce.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("api/webhook")
@CrossOrigin(origins = "*")
public class MercadoPagoController {

    private final PedidoService pedidoService;

    public MercadoPagoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> body) {
        System.out.println("Webhook recibido: " + body);

        String tipo = (String) body.get("type");
        if (!"payment".equals(tipo)) return ResponseEntity.ok("No es un pago");

        Map<String, Object> data = (Map<String, Object>) body.get("data");
        Long paymentId = Long.valueOf(data.get("id").toString());

        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(paymentId);

            MerchantOrderClient merchantOrderClient = new MerchantOrderClient();
            MerchantOrder order = merchantOrderClient.get(payment.getOrder().getId());

            String externalReference = order.getExternalReference();
            Long pedidoId = Long.valueOf(externalReference);

            String paymentStatus = payment.getStatus();
            System.out.printf("Pago ID: %d, Pedido ID: %d, Estado: %s%n", paymentId, pedidoId, paymentStatus);

            // 👉 Llamado al service
            pedidoService.actualizarEstadoPorPago(pedidoId, paymentStatus);

        } catch (MPApiException | MPException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar el pago");
        }

        return ResponseEntity.ok("OK");
    }

}