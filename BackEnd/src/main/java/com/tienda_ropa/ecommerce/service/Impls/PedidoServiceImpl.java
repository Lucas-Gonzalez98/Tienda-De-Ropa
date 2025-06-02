package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.repository.PedidoRepository;
import com.tienda_ropa.ecommerce.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    @Transactional
    public List<Pedido> getByClienteId(Long clienteId) {
        //Obtener todos los pedidos de un cliente específico
        return pedidoRepository.findByClienteIdAndEliminadoFalse(clienteId);
    }
}