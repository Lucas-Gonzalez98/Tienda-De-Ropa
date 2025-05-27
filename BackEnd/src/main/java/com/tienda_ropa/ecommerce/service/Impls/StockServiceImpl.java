package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.repository.StockRepository;
import com.tienda_ropa.ecommerce.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockServiceImpl extends MasterServiceImpl<Stock, Long> implements StockService {

    @Autowired
    public StockServiceImpl(StockRepository stockRepository) {
        super(stockRepository);
    }

}