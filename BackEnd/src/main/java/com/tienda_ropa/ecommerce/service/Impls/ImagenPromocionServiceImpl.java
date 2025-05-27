package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.ImagenPromocion;
import com.tienda_ropa.ecommerce.repository.ImagenPromocionRepository;
import com.tienda_ropa.ecommerce.service.ImagenPromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenPromocionServiceImpl extends MasterServiceImpl<ImagenPromocion, Long> implements ImagenPromocionService {

    @Autowired
    public ImagenPromocionServiceImpl(ImagenPromocionRepository imagenPromocionRepository) {
        super(imagenPromocionRepository);
    }

}