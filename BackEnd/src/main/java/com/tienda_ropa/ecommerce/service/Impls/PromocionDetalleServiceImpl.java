package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Categoria;
import com.tienda_ropa.ecommerce.model.Producto;
import com.tienda_ropa.ecommerce.model.Promocion;
import com.tienda_ropa.ecommerce.model.PromocionDetalle;
import com.tienda_ropa.ecommerce.repository.CategoriaRepository;
import com.tienda_ropa.ecommerce.repository.ProductoRepository;
import com.tienda_ropa.ecommerce.repository.PromocionDetalleRepository;
import com.tienda_ropa.ecommerce.repository.PromocionRepository;
import com.tienda_ropa.ecommerce.service.PromocionDetalleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromocionDetalleServiceImpl extends MasterServiceImpl<PromocionDetalle, Long> implements PromocionDetalleService {

    private final PromocionRepository promocionRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final PromocionDetalleRepository promocionDetalleRepository;

    @Autowired
    public PromocionDetalleServiceImpl(
            PromocionDetalleRepository promocionDetalleRepository,
            PromocionRepository promocionRepository,
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository
    ) {
        super(promocionDetalleRepository);
        this.promocionDetalleRepository = promocionDetalleRepository;
        this.promocionRepository = promocionRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // Asocia productos a promociones
    @Override
    @Transactional
    public void asociarProductosAPromocion(Long idPromocion, Long[] idsProducto) {
        Promocion promocion = promocionRepository.findById(idPromocion)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));

        for (Long idProducto : idsProducto) {
            Producto producto = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            PromocionDetalle detalle = new PromocionDetalle();
            detalle.setPromocion(promocion);
            detalle.setProducto(producto);
            detalle.setCantidad(1); // o lógica personalizada
            promocionDetalleRepository.save(detalle);
        }
    }

    //Asocia todos los productos de una categoría
    @Override
    @Transactional
    public void asociarProductosDeCategoria(Long idPromocion, Long idCategoria) {
        Promocion promocion = promocionRepository.findById(idPromocion)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));

        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        for (Producto producto : categoria.getProductos()) {
            PromocionDetalle detalle = new PromocionDetalle();
            detalle.setPromocion(promocion);
            detalle.setProducto(producto);
            detalle.setCantidad(1); // o lógica personalizada
            promocionDetalleRepository.save(detalle);
        }
    }

    //Quitar Producto de la Promocion.
    @Override
    @Transactional
    public void quitarProductoDePromocion(Long idPromocionDetalle) {
        promocionDetalleRepository.deleteById(idPromocionDetalle);
    }


}