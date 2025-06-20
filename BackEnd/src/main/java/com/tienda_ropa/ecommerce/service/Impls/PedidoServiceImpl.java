package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import com.tienda_ropa.ecommerce.model.enums.Rol;
import com.tienda_ropa.ecommerce.repository.*;
import com.tienda_ropa.ecommerce.service.PedidoService;
import com.tienda_ropa.ecommerce.service.email.EmailService;
import com.tienda_ropa.ecommerce.service.pdf.PdfGenerator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final DomicilioRepository domicilioRepository;
    private final StockRepository stockRepository;
    private final ProductoRepository productoRepository;
    private final HistoricoPrecioVentaRepository historicoPrecioVentaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PdfGenerator pdfGenerator;

    public PedidoServiceImpl(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
                             DomicilioRepository domicilioRepository,
                             StockRepository stockRepository, ProductoRepository productoRepository,
                             HistoricoPrecioVentaRepository historicoPrecioVentaRepository,
                             UsuarioRepository usuarioRepository, EmailService emailService, PdfGenerator pdfGenerator) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.domicilioRepository = domicilioRepository;
        this.stockRepository = stockRepository;
        this.productoRepository = productoRepository;
        this.historicoPrecioVentaRepository = historicoPrecioVentaRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
        this.pdfGenerator = pdfGenerator;
    }

    //Obtener todos los pedidos de un cliente específico
    @Override
    @Transactional
    public List<Pedido> getByClienteId(Long clienteId) {
        return pedidoRepository.findByClienteIdAndEliminadoFalse(clienteId);
    }

    @Override
    @Transactional
    public Pedido realizarPedido(Pedido pedido, Long clienteId, Long domicilioId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        // Asociar domicilio existente o guardar uno nuevo
        Domicilio domicilio;

        if (domicilioId != null) {
            domicilio = domicilioRepository.findById(domicilioId)
                    .orElseThrow(() -> new EntityNotFoundException("Domicilio no encontrado"));
        } else if (pedido.getDomicilio() != null) {
            // Verificar si ya existe uno igual (opcional: comparación por calle, número y código postal)
            domicilio = domicilioRepository.save(pedido.getDomicilio());

            // Opcional: agregar domicilio nuevo al cliente si corresponde
            cliente.getDomicilios().add(domicilio);
            clienteRepository.save(cliente);
        } else {
            throw new IllegalArgumentException("Debe especificarse un domicilio existente o uno nuevo");
        }

        pedido.setCliente(cliente);
        pedido.setDomicilio(domicilio);
        pedido.setFecha(LocalDate.now());
        pedido.setEstado(Estado.PENDIENTE);

        for (PedidoDetalle detalle : pedido.getDetalles()) {
            Producto producto = productoRepository.findById(detalle.getStock().getProducto().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            Long colorId = detalle.getStock().getColor().getId();
            Long talleId = detalle.getStock().getTalle().getId();

            Stock stock = stockRepository.findStockDisponible(producto.getId(), colorId, talleId)
                    .orElseThrow(() -> new EntityNotFoundException("Stock no disponible"));

            if (stock.getCantidad() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            stock.setCantidad(stock.getCantidad() - detalle.getCantidad());

            detalle.setPedido(pedido);
            detalle.getStock().setProducto(producto);

            HistoricoPrecioVenta ultimoPrecio = historicoPrecioVentaRepository
                    .findUltimoByProductoId(producto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("No hay precio para producto"));

            detalle.setPrecio(ultimoPrecio.getPrecio());
        }

        return pedidoRepository.save(pedido);
    }

    // búsqueda filtrada para ver pedidos realizados
    @Override
    @Transactional
    public List<Pedido> getByFiltros(Long clienteId, String estadoStr, LocalDate fechaDesde, LocalDate fechaHasta) {
        Estado estado = null;
        if (estadoStr != null && !estadoStr.isEmpty()) {
            try {
                estado = Estado.valueOf(estadoStr.toUpperCase()); // Asegura coincidencia con enum
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Estado inválido: " + estadoStr);
            }
        }

        return pedidoRepository.findByFiltros(clienteId, estado, fechaDesde, fechaHasta);
    }

    //CAMBIAR DE ESTADO EL PEDIDO
    @Transactional
    @Override
    public void cambiarEstadoPedido(Long pedidoId, Estado nuevoEstado, Long usuarioId, Rol rol) {

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Validación por ROL
        if (rol == Rol.CLIENTE) {
            if (!pedido.getCliente().getUsuario().getId().equals(usuarioId)) {
                throw new AccessDeniedException("El cliente no puede modificar pedidos de otros.");
            }
            if (pedido.getEstado() != Estado.PENDIENTE || nuevoEstado != Estado.CANCELADO) {
                throw new AccessDeniedException("El cliente solo puede cancelar pedidos en estado PENDIENTE.");
            }
        } else if (rol == Rol.ADMINISTRADOR) {
            if (!EnumSet.of(Estado.PROCESANDO, Estado.EN_CAMINO, Estado.ENTREGADO, Estado.CANCELADO).contains(nuevoEstado)) {
                throw new IllegalArgumentException("El estado solicitado no es válido para administradores.");
            }
        } else {
            throw new AccessDeniedException("Rol no permitido.");
        }

        // Actualizar estado
        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);

        if (nuevoEstado == Estado.CANCELADO) {
            for (PedidoDetalle detalle : pedido.getDetalles()) {
                Stock stock = detalle.getStock();

                // Validación opcional para asegurar que el stock existe
                if (stock == null) {
                    throw new EntityNotFoundException("Stock no encontrado para el detalle del pedido");
                }

                // Incrementar la cantidad en stock
                stock.setCantidad(stock.getCantidad() + detalle.getCantidad());
                stockRepository.save(stock);
            }
        }

        // Generar PDF y enviar email
        String mensaje = switch (nuevoEstado) {
            case PENDIENTE -> "Tu pedido ha sido registrado y está pendiente de aprobación.";
            case PROCESANDO -> "Tu pedido fue aprobado y está siendo preparado.";
            case EN_CAMINO -> "Tu pedido está listo, ya se está enviando a su destino. ¡Ojalá llegue pronto!";
            case ENTREGADO -> "Hemos entregado tu pedido. ¡Gracias por tu compra!";
            case CANCELADO -> "El pedido ha sido cancelado. Si no realizaste esta acción, por favor contáctanos.";
            default -> "Tu pedido cambió de estado.";
        };
        //byte[] pdf = pdfGenerator.generarResumenCambioEstado(pedido, nuevoEstado, mensaje);
        //emailService.enviarEmailEstadoPedido(pedido.getCliente().getUsuario().getEmail(), nuevoEstado, mensaje, pdf);
    }


    //Cambiar estado del Pedido Dependiendo de el Pago de Mercado Pago
    @Override
    @Transactional
    public void actualizarEstadoPorPago(Long pedidoId, String paymentStatus) {
        Optional<Pedido> optionalPedido = pedidoRepository.findById(pedidoId);

        if (optionalPedido.isEmpty()) {
            log.warn("Pedido con ID {} no encontrado", pedidoId);
            return;
        }

        Pedido pedido = optionalPedido.get();
        Estado nuevoEstado = mapearEstadoDesdePago(paymentStatus);

        if (pedido.getEstado() == nuevoEstado) {
            log.info("El estado del pedido con ID {} ya es {}. No se realizan cambios.", pedidoId, nuevoEstado);
            return;
        }

        log.info("Actualizando estado del pedido {} de {} a {}", pedidoId, pedido.getEstado(), nuevoEstado);
        pedido.setEstado(nuevoEstado);

        //Si el estado es CANCELADO → devolver al Stock
        if (nuevoEstado == Estado.CANCELADO) {
            log.info("Rollback de stock para pedido cancelado ID {}", pedidoId);
            pedido.getDetalles().forEach(detalle -> {
                Stock stock = detalle.getStock();

                // Incrementar la cantidad en stock
                stock.setCantidad(stock.getCantidad() + detalle.getCantidad());
                stockRepository.save(stock);

                log.info("Stock actualizado para producto ID {} (color: {}, talle: {}) - nueva cantidad: {}",
                        stock.getProducto().getId(),
                        stock.getColor().getNombre(),
                        stock.getTalle().getNombre(),
                        stock.getCantidad());
            });
        }

        pedidoRepository.save(pedido);
    }

    private Estado mapearEstadoDesdePago(String paymentStatus) {
        return switch (paymentStatus) {
            case "approved" -> Estado.PROCESANDO;
            case "pending", "in_process", "in_mediation" -> Estado.PENDIENTE;
            case "rejected", "refunded", "cancelled", "charged_back" -> Estado.CANCELADO;
            default -> Estado.PENDIENTE; // Comportamiento por defecto
        };
    }
}