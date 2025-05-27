package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.PedidoDetalle;
import com.tienda_ropa.ecommerce.repository.PedidoDetalleRepository;
import com.tienda_ropa.ecommerce.service.PedidoDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoDetalleServiceImpl extends MasterServiceImpl<PedidoDetalle, Long> implements PedidoDetalleService {

    @Autowired
    public PedidoDetalleServiceImpl(PedidoDetalleRepository pedidoDetalleRepository) {
        super(pedidoDetalleRepository);
    }

}