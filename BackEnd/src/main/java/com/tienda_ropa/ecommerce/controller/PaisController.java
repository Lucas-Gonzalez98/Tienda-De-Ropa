package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Pais;
import com.tienda_ropa.ecommerce.service.PaisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pais")
public class PaisController extends MasterController<Pais, Long> {

    private final PaisService PaisService;

    public PaisController(PaisService PaisService) {
        super(PaisService);
        this.PaisService = PaisService;
    }



}