package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.service.ColorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/color")
public class ColorController extends MasterController<Color, Long> {

    private final ColorService colorService;

    public ColorController(ColorService colorService) {
        super(colorService);
        this.colorService = colorService;
    }



}