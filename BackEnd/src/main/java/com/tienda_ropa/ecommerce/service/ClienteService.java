package com.tienda_ropa.ecommerce.service;

import com.tienda_ropa.ecommerce.model.Cliente;
import com.tienda_ropa.ecommerce.model.Domicilio;

import java.util.Optional;

public interface ClienteService extends MasterService<Cliente, Long> {
    // Metodo específico para guardar cliente con manejo de entidades relacionadas
    Cliente saveWithRelatedEntities(Cliente cliente);
    public Cliente updateWithRelatedEntities(Long id, Cliente cliente);
    public Optional<Cliente> findByUsuarioId(Long usuarioId);
    public Domicilio agregarDomicilio(Long clienteId, Domicilio domicilioRequest);
}