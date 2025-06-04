package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Categoria;
import com.tienda_ropa.ecommerce.repository.CategoriaRepository;
import com.tienda_ropa.ecommerce.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaServiceImpl extends MasterServiceImpl<Categoria, Long> implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository, CategoriaRepository categoriaRepository1) {
        super(categoriaRepository);
        this.categoriaRepository = categoriaRepository1;
    }

    public List<Categoria> findAllExcludingFirst(){
        return categoriaRepository.findAllExcludingFirst();
    }

    @Override
    public List<Categoria> findByDenominacion(String denominacion) {
        return categoriaRepository.findByDenominacion(denominacion);
    }

}