package com.tienda_ropa.ecommerce.controller;



import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.mercadopago.PreferenceMP;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MercadoPagoController {

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
                    .success("http://localhost:5173")
                    .pending("http://localhost:5173")
                    .failure("http://localhost:5173")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
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