package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.model.enums.Estado;
import com.tienda_ropa.ecommerce.repository.*;
import com.tienda_ropa.ecommerce.service.PedidoService;
import jakarta.persistence.EntityNotFoundException;
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

    public PedidoServiceImpl(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
                             DomicilioRepository domicilioRepository,
                             StockRepository stockRepository, ProductoRepository productoRepository,
                             HistoricoPrecioVentaRepository historicoPrecioVentaRepository){
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.domicilioRepository = domicilioRepository;
        this.stockRepository = stockRepository;
        this.productoRepository = productoRepository;
        this.historicoPrecioVentaRepository = historicoPrecioVentaRepository;
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

}