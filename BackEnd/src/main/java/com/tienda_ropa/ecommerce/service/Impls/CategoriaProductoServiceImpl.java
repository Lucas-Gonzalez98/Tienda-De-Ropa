package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.CategoriaProducto;
import com.tienda_ropa.ecommerce.repository.CategoriaProductoRepository;
import com.tienda_ropa.ecommerce.service.CategoriaProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoriaProductoServiceImpl extends MasterServiceImpl<CategoriaProducto, Long> implements CategoriaProductoService {

    @Autowired
    public CategoriaProductoServiceImpl(CategoriaProductoRepository categoriaProductoRepository) {
        super(categoriaProductoRepository);
    }

}