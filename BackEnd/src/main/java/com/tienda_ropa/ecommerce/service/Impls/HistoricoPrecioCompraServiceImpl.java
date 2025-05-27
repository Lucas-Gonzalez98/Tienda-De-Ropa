package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import com.tienda_ropa.ecommerce.repository.HistoricoPrecioCompraRepository;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoricoPrecioCompraServiceImpl extends MasterServiceImpl<HistoricoPrecioCompra, Long> implements HistoricoPrecioCompraService {

    @Autowired
    public HistoricoPrecioCompraServiceImpl(HistoricoPrecioCompraRepository historicoPrecioCompraRepository) {
        super(historicoPrecioCompraRepository);
    }

}