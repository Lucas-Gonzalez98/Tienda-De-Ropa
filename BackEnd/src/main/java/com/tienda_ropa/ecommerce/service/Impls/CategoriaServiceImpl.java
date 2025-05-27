package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Categoria;
import com.tienda_ropa.ecommerce.repository.CategoriaRepository;
import com.tienda_ropa.ecommerce.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoriaServiceImpl extends MasterServiceImpl<Categoria, Long> implements CategoriaService {

    @Autowired
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        super(categoriaRepository);
    }

}