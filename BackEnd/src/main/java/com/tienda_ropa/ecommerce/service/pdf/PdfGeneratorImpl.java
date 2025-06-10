package com.tienda_ropa.ecommerce.service.pdf;

import com.lowagie.text.pdf.draw.LineSeparator;
import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.model.enums.Estado;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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

    @Override
    public byte[] generarFacturaPedido(Pedido pedido) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Encabezado
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("es", "AR"));

            document.add(new Paragraph("FACTURA", titleFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Fecha emisión: " +
                    (pedido.getFecha() != null ? pedido.getFecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : ""), smallFont));
            document.add(new Paragraph("N° Pedido: " +
                    (pedido.getId() != null ? pedido.getId().toString() : ""), smallFont));
            document.add(new Paragraph("Estado: " +
                    (pedido.getEstado() != null ? pedido.getEstado().toString() : ""), smallFont));
            document.add(new Paragraph(" "));

            // Datos del Cliente
            Cliente cliente = pedido.getCliente();
            Domicilio domicilio = pedido.getDomicilio();

            document.add(new Paragraph("Datos del Cliente", boldFont));
            document.add(new Paragraph("Nombre: " +
                    (cliente.getNombre() != null ? cliente.getNombre() : "") + " " +
                    (cliente.getApellido() != null ? cliente.getApellido() : ""), normalFont));
            document.add(new Paragraph("Teléfono: " +
                    (cliente.getTelefono() != null && cliente.getTelefono().getNumero() != null
                            ? cliente.getTelefono().getNumero()
                            : ""), normalFont));
            document.add(new Paragraph("Domicilio de entrega: " +
                    (domicilio.getCalle() != null ? domicilio.getCalle() : "") + " " +
                    (domicilio.getNumero() != null ? domicilio.getNumero() : "") +
                    (domicilio.getReferencia() != null ? " (" + domicilio.getReferencia() + ")" : "") +
                    " - CP: " + (domicilio.getCodigoPostal() != null ? domicilio.getCodigoPostal() : ""), normalFont));
            document.add(new Paragraph(" "));

            // Detalle de Productos
            PdfPTable table = new PdfPTable(4); // 4 columnas correctas
            table.setWidths(new float[]{3, 1, 1, 1});
            table.setWidthPercentage(100);

            // Encabezados
            table.addCell(createHeaderCell("Producto"));
            table.addCell(createHeaderCell("Precio Unit."));
            table.addCell(createHeaderCell("Cantidad"));
            table.addCell(createHeaderCell("Subtotal"));

            double total = 0;

            for (PedidoDetalle det : pedido.getDetalles()) {
                Producto prod = det.getStock().getProducto();
                double subtotal = det.getPrecio() * det.getCantidad();
                total += subtotal;

                table.addCell(createNormalCell(prod.getNombre() != null ? prod.getNombre() : ""));
                table.addCell(createNormalCell(currencyFormatter.format(det.getPrecio())));
                table.addCell(createNormalCell(String.valueOf(det.getCantidad())));
                table.addCell(createNormalCell(currencyFormatter.format(subtotal)));
            }

            // Fila Total
            PdfPCell cell = new PdfPCell(new Phrase("TOTAL", boldFont));
            cell.setColspan(3);
            cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase(currencyFormatter.format(total), boldFont));
            cell.setColspan(1);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);

            document.add(table);

            document.add(new Paragraph(" "));

            // Separador visual
            LineSeparator separator = new LineSeparator();
            separator.setLineColor(Color.LIGHT_GRAY);
            document.add(separator);

            document.add(new Paragraph("¡Gracias por tu compra!", normalFont));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando factura PDF", e);
        }
    }

    // Métodos utilitarios para formato de tabla
    private PdfPCell createHeaderCell(String text) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(new Color(220, 220, 220));
        return cell;
    }

    private PdfPCell createNormalCell(String text) {
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        PdfPCell cell = new PdfPCell(new Phrase(text, normalFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

}

