package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;
import com.tienda_ropa.ecommerce.repository.HistoricoPrecioVentaRepository;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoricoPrecioVentaServiceImpl extends MasterServiceImpl<HistoricoPrecioVenta, Long> implements HistoricoPrecioVentaService {

    @Autowired
    public HistoricoPrecioVentaServiceImpl(HistoricoPrecioVentaRepository historicoPrecioVentaRepository) {
        super(historicoPrecioVentaRepository);
    }

}