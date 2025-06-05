package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.HistoricoPrecioVenta;
import com.tienda_ropa.ecommerce.repository.HistoricoPrecioVentaRepository;
import com.tienda_ropa.ecommerce.service.HistoricoPrecioVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoricoPrecioVentaServiceImpl extends MasterServiceImpl<HistoricoPrecioVenta, Long> implements HistoricoPrecioVentaService {

    private final HistoricoPrecioVentaRepository historicoPrecioVentaRepository;
    @Autowired
    public HistoricoPrecioVentaServiceImpl(HistoricoPrecioVentaRepository historicoPrecioVentaRepository) {
        super(historicoPrecioVentaRepository);
        this.historicoPrecioVentaRepository = historicoPrecioVentaRepository;
    }

    @Override
    public Optional<HistoricoPrecioVenta> obtenerUltimoPorProducto(Long productoId) {
        return historicoPrecioVentaRepository.findUltimoByProductoId(productoId);
    }

    @Override
    public List<HistoricoPrecioVenta> listarTodosOrdenadosPorFecha() {
        return historicoPrecioVentaRepository.findAllByEliminadoFalseOrderByFechaDesc();
    }

    @Override
    public List<HistoricoPrecioVenta> listarPorProductoOrdenadosPorFecha(Long productoId) {
        return historicoPrecioVentaRepository.findAllByProductoIdAndEliminadoFalseOrderByFechaDesc(productoId);
    }

}