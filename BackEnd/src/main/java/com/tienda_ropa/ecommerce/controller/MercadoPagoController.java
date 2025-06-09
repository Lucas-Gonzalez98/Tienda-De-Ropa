package com.tienda_ropa.ecommerce.controller;



import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.mercadopago.PreferenceMP;
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

    @PostMapping
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> body) {
        System.out.println("Webhook recibido: " + body);

        String tipo = (String) body.get("type");
        if (!"payment".equals(tipo)) return ResponseEntity.ok("No es un pago");

        // Extraer ID de pago
        Map<String, Object> data = (Map<String, Object>) body.get("data");
        Long paymentId = Long.valueOf(data.get("id").toString());

        try {
            // Crear cliente
            PaymentClient client = new PaymentClient();
            // Obtener info del pago
            Payment payment = client.get(paymentId);

            System.out.println("Estado del pago: " + payment.getStatus());
            System.out.println("Monto: " + payment.getTransactionAmount());

            // TODO: actualizar el pedido según el estado del pago

        } catch (MPApiException | MPException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("ok");
    }

    public PreferenceMP getPreferenciaIdMercadoPago(Pedido pedido) {
        try {

            MercadoPagoConfig.setAccessToken("APP_USR-7115001971388140-050722-baace1bc7839f6490b933b2685a0a38d-2430217802");

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(pedido.getId()))
                    .title("Articulos")
                    .description("Pedido realizado desde el carrito de compras")
                    .pictureUrl("https://img.freepik.com/vector-gratis/diferentes-tipos-instrumentos-musicales_1308-3320.jpg")
                    .quantity(1)
                    .currencyId("ARS")
                    .unitPrice(BigDecimal.valueOf(pedido.getTotalPedido()))
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            PreferenceBackUrlsRequest backURL = PreferenceBackUrlsRequest.builder()
                    .success("https://www.youtube.com/")
                    .pending("http://localhost:5173")
                    .failure("http://localhost:5173")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .notificationUrl("https://2869-2803-9800-9849-7c6d-d16f-c3c4-3dfd-54a9.ngrok-free.app/api/webhook")
                    .externalReference(String.valueOf(pedido.getId()))
                    .items(items)
                    .backUrls(backURL)
                    .build();

            PreferenceClient client = new PreferenceClient();

            Preference preference = client.create(preferenceRequest);
            System.out.println(preference.getResponse());

            PreferenceMP mpPreference = new PreferenceMP();
            mpPreference.setStatusCode(preference.getResponse().getStatusCode());
            mpPreference.setId(preference.getId());

            return mpPreference;

        } catch (MPApiException e) {
            var apiResponse = e.getApiResponse();
            var content = apiResponse.getContent();
            System.out.println(content);
            return null;
        } catch (MPException e) {
            throw new RuntimeException(e);
        }

    }

}