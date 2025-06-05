package com.tienda_ropa.ecommerce.service.email;

import com.tienda_ropa.ecommerce.model.enums.Estado;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void enviarEmailEstadoPedido(String destinatario, Estado estado, String mensaje, byte[] pdfAdjunto) {
        try {
            MimeMessage mensajeMail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensajeMail, true);
            helper.setTo(destinatario);
            helper.setSubject("Actualización de estado de tu pedido: " + estado);
            helper.setText(mensaje);

            helper.addAttachment("resumen_estado_pedido.pdf", new ByteArrayResource(pdfAdjunto));

            mailSender.send(mensajeMail);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo", e);
        }
    }
}
