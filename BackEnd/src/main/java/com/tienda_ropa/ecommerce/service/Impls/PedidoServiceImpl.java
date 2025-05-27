package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Pedido;
import com.tienda_ropa.ecommerce.repository.PedidoRepository;
import com.tienda_ropa.ecommerce.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        super(pedidoRepository);
    }

}