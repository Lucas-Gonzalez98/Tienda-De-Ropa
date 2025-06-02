package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.repository.ClienteRepository;
import com.tienda_ropa.ecommerce.repository.LocalidadRepository;
import com.tienda_ropa.ecommerce.repository.TelefonoRepository;
import com.tienda_ropa.ecommerce.repository.UsuarioRepository;
import com.tienda_ropa.ecommerce.service.ClienteService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class ClienteServiceImpl extends MasterServiceImpl<Cliente, Long> implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final LocalidadRepository localidadRepository;
    private final TelefonoRepository telefonoRepository;
    private final UsuarioRepository usuarioRepository;
    
    private static final Logger logger = LoggerFactory.getLogger(ClienteServiceImpl.class);

    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository, 
                             LocalidadRepository localidadRepository,
                             TelefonoRepository telefonoRepository,
                             UsuarioRepository usuarioRepository) {
        super(clienteRepository);
        this.clienteRepository = clienteRepository;
        this.localidadRepository = localidadRepository;
        this.telefonoRepository = telefonoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Cliente saveWithRelatedEntities(Cliente cliente) {
        logger.info("Guardando cliente con entidades relacionadas: {}", cliente.getNombre());
        
        try {
            // 1. Manejar Teléfono
            if (cliente.getTelefono() != null) {
                // Si el teléfono no tiene ID, es nuevo
                if (cliente.getTelefono().getId() == null) {
                    Telefono telefonoGuardado = telefonoRepository.save(cliente.getTelefono());
                    cliente.setTelefono(telefonoGuardado);
                    logger.info("Teléfono guardado con ID: {}", telefonoGuardado.getId());
                }
            }

            // 2. Manejar Usuario
            if (cliente.getUsuario() != null) {
                // Si el usuario no tiene ID, es nuevo
                if (cliente.getUsuario().getId() == null) {
                    Usuario usuarioGuardado = usuarioRepository.save(cliente.getUsuario());
                    cliente.setUsuario(usuarioGuardado);
                    logger.info("Usuario guardado con ID: {}", usuarioGuardado.getId());
                }
            }

            // 3. Manejar Domicilios y sus Localidades
            if (cliente.getDomicilios() != null && !cliente.getDomicilios().isEmpty()) {
                Set<Domicilio> domiciliosActualizados = new HashSet<>();
                
                for (Domicilio domicilio : cliente.getDomicilios()) {
                    // Manejar la localidad existente
                    if (domicilio.getLocalidad() != null && domicilio.getLocalidad().getId() != null) {
                        Localidad localidadExistente = localidadRepository.findById(domicilio.getLocalidad().getId())
                                .orElseThrow(() -> new EntityNotFoundException("Localidad no encontrada con ID: " + domicilio.getLocalidad().getId()));
                        domicilio.setLocalidad(localidadExistente);
                        logger.info("Localidad asociada: {} (ID: {})", localidadExistente.getNombre(), localidadExistente.getId());
                    }
                    domiciliosActualizados.add(domicilio);
                }
                
                cliente.setDomicilios(domiciliosActualizados);
            }

            // 4. Guardar el cliente
            Cliente clienteGuardado = super.save(cliente);
            logger.info("Cliente guardado exitosamente con ID: {}", clienteGuardado.getId());
            
            return clienteGuardado;
            
        } catch (Exception e) {
            logger.error("Error al guardar cliente: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar cliente: " + e.getMessage(), e);
        }
    }

    @Override
    public Cliente save(Cliente entity) {
        // Redirigir al método especializado
        return saveWithRelatedEntities(entity);
    }
}