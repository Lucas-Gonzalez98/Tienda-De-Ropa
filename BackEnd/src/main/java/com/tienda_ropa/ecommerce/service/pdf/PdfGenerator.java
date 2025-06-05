package com.tienda_ropa.ecommerce.service.pdf;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.enums.Estado;

public interface PdfGenerator {
    byte[] generarResumenCambioEstado(Pedido pedido, Estado nuevoEstado, String mensajeEstado);
}
