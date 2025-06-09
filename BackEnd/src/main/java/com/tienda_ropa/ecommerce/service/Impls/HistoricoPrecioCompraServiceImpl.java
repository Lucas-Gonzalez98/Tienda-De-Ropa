package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioCompra;
import com.tienda_ropa.ecommerce.repository.HistoricoPrecioCompraRepository;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HistoricoPrecioCompraServiceImpl extends MasterServiceImpl<HistoricoPrecioCompra, Long> implements HistoricoPrecioCompraService {

    private final HistoricoPrecioCompraRepository historicoPrecioCompraRepository;

    @Autowired
    public HistoricoPrecioCompraServiceImpl(HistoricoPrecioCompraRepository historicoPrecioCompraRepository) {
        super(historicoPrecioCompraRepository);
        this.historicoPrecioCompraRepository = historicoPrecioCompraRepository;
    }

    @Override
    public Optional<HistoricoPrecioCompra> obtenerUltimoPorProducto(Long productoId) {
        return historicoPrecioCompraRepository.findUltimoByProductoId(productoId);
    }

    @Override
    public List<HistoricoPrecioCompra> listarTodosOrdenadosPorFecha() {
        return historicoPrecioCompraRepository.findAllByEliminadoFalseOrderByFechaDesc();
    }

    @Override
    public List<HistoricoPrecioCompra> listarPorProductoOrdenadosPorFecha(Long productoId) {
        return historicoPrecioCompraRepository.findAllByProductoIdAndEliminadoFalseOrderByFechaDesc(productoId);
    }

    @Override
    public List<HistoricoPrecioCompra> getUltimosById(Long productoId, int limite) {
        Pageable pageable = PageRequest.of(0, limite);
        return historicoPrecioCompraRepository.findUltimosByProductoId(productoId, pageable);
    }
}