package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController extends MasterController<Stock, Long> {

    private final StockService StockService;

    public StockController(StockService StockService) {
        super(StockService);
        this.StockService = StockService;
    }



}