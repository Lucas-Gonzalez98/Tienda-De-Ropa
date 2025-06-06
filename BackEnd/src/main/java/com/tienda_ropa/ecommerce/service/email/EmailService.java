package com.tienda_ropa.ecommerce.service.email;

import com.tienda_ropa.ecommerce.model.enums.Estado;

public interface EmailService {
    void enviarEmailEstadoPedido(String destinatario, Estado estado, String mensaje, byte[] pdfAdjunto);
}
