package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Cliente;

public interface ClienteService extends MasterService<Cliente, Long> {
    // Método específico para guardar cliente con manejo de entidades relacionadas
    Cliente saveWithRelatedEntities(Cliente cliente);
}