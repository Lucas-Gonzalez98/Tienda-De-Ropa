package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.repository.ProductoRepository;
import com.tienda_ropa.ecommerce.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoServiceImpl extends MasterServiceImpl<Producto, Long> implements ProductoService {

    @Autowired
    public ProductoServiceImpl(ProductoRepository productoRepository) {
        super(productoRepository);
    }

}