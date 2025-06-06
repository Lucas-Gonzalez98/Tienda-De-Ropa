package com.tienda_ropa.ecommerce.service.pdf;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;

import java.io.IOException;
import java.time.LocalDate;

@Service
public class PdfGeneratorImpl implements PdfGenerator {

    @Override
    public byte[] generarResumenCambioEstado(Pedido pedido, Estado nuevoEstado, String mensajeEstado) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Resumen de cambio de estado del pedido"));
            document.add(new Paragraph("Número de Pedido: " + pedido.getId()));
            document.add(new Paragraph("Cliente: " + pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido()));
            document.add(new Paragraph("Fecha del cambio: " + LocalDate.now()));
            document.add(new Paragraph("Nuevo Estado: " + nuevoEstado));
            document.add(new Paragraph("Mensaje: " + mensajeEstado));

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }
}

