package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.repository.ColorRepository;
import com.tienda_ropa.ecommerce.service.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ColorServiceImpl extends MasterServiceImpl<Color, Long> implements ColorService {

    @Autowired
    public ColorServiceImpl(ColorRepository colorRepository) {
        super(colorRepository);
    }

}