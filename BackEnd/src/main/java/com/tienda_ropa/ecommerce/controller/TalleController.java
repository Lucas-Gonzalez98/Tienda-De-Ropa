package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Talle;
import com.tienda_ropa.ecommerce.service.TalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talle")
public class TalleController extends MasterController<Talle, Long> {

    private final TalleService TalleService;

    public TalleController(TalleService TalleService) {
        super(TalleService);
        this.TalleService = TalleService;
    }



}