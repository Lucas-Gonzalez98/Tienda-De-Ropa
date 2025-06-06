package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Color;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Stock;
import com.tienda_ropa.ecommerce.model.Talle;
import com.tienda_ropa.ecommerce.repository.StockRepository;
import com.tienda_ropa.ecommerce.service.StockService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl extends MasterServiceImpl<Stock, Long> implements StockService {

    private final StockRepository stockRepository;

    @Autowired
    public StockServiceImpl(StockRepository stockRepository) {
        super(stockRepository);
        this.stockRepository = stockRepository;
    }

    //filtrar stock por talle, color y disponibilidad
    @Override
    public List<Stock> getDisponiblesPorTalleYColor(Talle talle, Color color) {

        return stockRepository.findByTalleAndColorAndCantidadGreaterThan(talle, color, 0);
    }
    //obtener todos los el stock con cantidad > 0
    @Override
    public List<Stock> getDisponibles() {
        return stockRepository.findByCantidadGreaterThan(0);
    }
    // cantidad de stock por producto, talle y color)
    @Override
    public int obtenerCantidadStockDisponible(Producto producto, Talle talle, Color color) {
        return stockRepository.obtenerCantidadStockDisponible(producto, talle, color);
    }

    // actualizar stock para una combinación
    @Override
    @Transactional
    public Stock actualizarCantidad(Long idProducto, Long idColor, Long idTalle, Integer nuevaCantidad) {
        Stock stock = stockRepository.findStockDisponible(idProducto, idColor, idTalle)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado para la combinación"));
        stock.setCantidad(nuevaCantidad);
        return stockRepository.save(stock);
    }
}