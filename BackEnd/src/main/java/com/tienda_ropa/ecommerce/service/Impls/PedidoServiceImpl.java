package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import com.tienda_ropa.ecommerce.model.enums.Rol;
import com.tienda_ropa.ecommerce.repository.*;
import com.tienda_ropa.ecommerce.service.PedidoService;
import com.tienda_ropa.ecommerce.service.email.EmailService;
import com.tienda_ropa.ecommerce.service.pdf.PdfGenerator;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
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

    //Realizar un pedido
    @Override
    @Transactional
    public Pedido realizarPedido(Pedido pedido, Long clienteId, Long domicilioId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        Domicilio domicilio = domicilioRepository.findById(domicilioId)
                .orElseThrow(() -> new EntityNotFoundException("Domicilio no encontrado"));

        pedido.setCliente(cliente);
        pedido.setFecha(LocalDate.now());
        pedido.setEstado(Estado.PENDIENTE);

        for (PedidoDetalle detalle : pedido.getDetalles()) {
            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            Long colorId = detalle.getProducto().getColor().getId();
            Long talleId = detalle.getProducto().getTalle().getId();

            Stock stock = stockRepository.findStockDisponible(producto.getId(), colorId, talleId)
                    .orElseThrow(() -> new EntityNotFoundException("Stock no disponible"));

            if (stock.getCantidad() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            stock.setCantidad(stock.getCantidad() - detalle.getCantidad());

            detalle.setPedido(pedido);
            detalle.setProducto(producto);

            // Precio desde histórico o algún valor actual
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
    public List<Pedido> getByFiltros(Long clienteId, String estado, LocalDate fechaDesde, LocalDate fechaHasta) {
        return pedidoRepository.findByFiltros(clienteId, estado, fechaDesde, fechaHasta);
    }

    //Actualizar el estado del pedido.
    @Override
    @Transactional
    public void cambiarEstadoPedido(Long pedidoId, Estado nuevoEstado, Long usuarioId, Rol rol) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Cliente cliente = pedido.getCliente();
        boolean esCliente = rol == Rol.CLIENTE;

        if (esCliente && !cliente.getUsuario().getId().equals(usuarioId)) {
            throw new AccessDeniedException("No puedes modificar pedidos que no son tuyos");
        }

        if (esCliente && pedido.getEstado() != Estado.PENDIENTE) {
            throw new IllegalStateException("Solo puedes cancelar pedidos en estado PENDIENTE");
        }

        Estado estadoAnterior = pedido.getEstado();
        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);

        String mensajeEstado = obtenerMensajeEstado(nuevoEstado);
        byte[] pdf = pdfGenerator.generarResumenCambioEstado(pedido, nuevoEstado, mensajeEstado);
        emailService.enviarEmailEstadoPedido(cliente.getUsuario().getEmail(), nuevoEstado, mensajeEstado, pdf);
    }

    //Mensaje para cada estado.
    private String obtenerMensajeEstado(Estado estado) {
        return switch (estado) {
            case PENDIENTE -> "Tu pedido ha sido registrado y está pendiente de aprobación.";
            case PROCESANDO -> "Tu pedido fue aprobado y está siendo preparado.";
            case EN_CAMINO -> "Tu pedido está listo, ya se está enviando a su destino. ¡Ojalá llegue pronto!";
            case ENTREGADO -> "Hemos entregado tu pedido. ¡Gracias por tu compra!";
            case CANCELADO -> "El pedido ha sido cancelado. Si no realizaste esta acción, por favor contáctanos.";
        };
    }
}