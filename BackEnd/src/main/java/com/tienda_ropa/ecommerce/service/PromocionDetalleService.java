package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.PromocionDetalle;

public interface PromocionDetalleService extends MasterService<PromocionDetalle, Long> {

    // Asocia productos a promociones
    void asociarProductosAPromocion(Long idPromocion, Long[] idsProducto);

    // Asocia todos los productos de una categoría
    void asociarProductosDeCategoria(Long idPromocion, Long idCategoria);

    // Quita un producto de una promoción
    void quitarProductoDePromocion(Long idPromocionDetalle);
}