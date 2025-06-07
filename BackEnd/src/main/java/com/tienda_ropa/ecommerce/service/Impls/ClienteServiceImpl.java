package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.*;
import com.tienda_ropa.ecommerce.repository.*;
import com.tienda_ropa.ecommerce.service.ClienteService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class ClienteServiceImpl extends MasterServiceImpl<Cliente, Long> implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final LocalidadRepository localidadRepository;
    private final TelefonoRepository telefonoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DomicilioRepository domicilioRepository;
    
    private static final Logger logger = LoggerFactory.getLogger(ClienteServiceImpl.class);

    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository, 
                             LocalidadRepository localidadRepository,
                             TelefonoRepository telefonoRepository,
                             UsuarioRepository usuarioRepository,
                              DomicilioRepository domicilioRepository) {
        super(clienteRepository);
        this.clienteRepository = clienteRepository;
        this.localidadRepository = localidadRepository;
        this.telefonoRepository = telefonoRepository;
        this.usuarioRepository = usuarioRepository;
        this.domicilioRepository = domicilioRepository;
    }

    @Override
    public Cliente saveWithRelatedEntities(Cliente cliente) {
        logger.info("Guardando cliente con entidades relacionadas: {}", cliente.getNombre());
        
        try {
            // 1. Manejar Teléfono
            if (cliente.getTelefono() != null && cliente.getTelefono().getNumero() != null) {
                String numeroTelefono = cliente.getTelefono().getNumero().trim();

                Optional<Telefono> telefonoExistente = telefonoRepository.findByNumero(numeroTelefono);

                if (telefonoExistente.isPresent()) {
                    logger.info("Teléfono ya existe. Asociando con ID: {}", telefonoExistente.get().getId());
                    cliente.setTelefono(telefonoExistente.get());
                } else {
                    Telefono nuevoTelefono = cliente.getTelefono();
                    Telefono telefonoGuardado = telefonoRepository.save(nuevoTelefono);
                    cliente.setTelefono(telefonoGuardado);
                    logger.info("Teléfono nuevo guardado con ID: {}", telefonoGuardado.getId());
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

    public Cliente updateWithRelatedEntities(Long id, Cliente cliente) {
        logger.info("Actualizando cliente con ID {} y entidades relacionadas", id);

        Cliente clienteExistente = getById(id); // o findById(id).orElseThrow...

        // 1. Teléfono
        if (cliente.getTelefono() != null && cliente.getTelefono().getNumero() != null) {
            String numeroTelefono = cliente.getTelefono().getNumero().trim();

            Optional<Telefono> telefonoExistente = telefonoRepository.findByNumero(numeroTelefono);

            if (telefonoExistente.isPresent()) {
                cliente.setTelefono(telefonoExistente.get());
            } else {
                // No uses el ID si el número es nuevo
                Telefono nuevoTelefono = new Telefono();
                nuevoTelefono.setNumero(numeroTelefono);
                nuevoTelefono.setEliminado(false); // si lo usás
                Telefono telefonoGuardado = telefonoRepository.save(nuevoTelefono);
                cliente.setTelefono(telefonoGuardado);
            }
        }

        // 2. Usuario (no debería cambiar en update normalmente, pero se puede actualizar algún campo si querés)

        // 3. Domicilios (si permitís editar en esta pantalla, podrías actualizar eso también)

        // 4. Preservar relaciones necesarias desde el cliente existente
        cliente.setId(id);
        cliente.setUsuario(clienteExistente.getUsuario()); // Ojo con esto si no viene del frontend
        // Otros campos que no vienen desde el frontend y deban mantenerse...

        return super.update(id, cliente);
    }

    @Override
    public Optional<Cliente> findByUsuarioId(Long usuarioId) {
        return clienteRepository.findByUsuarioId(usuarioId);
    }
    @Override
    @Transactional
    public Domicilio agregarDomicilio(Long clienteId, Domicilio domicilioRequest) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));

        if (domicilioRequest.getLocalidad() == null || domicilioRequest.getLocalidad().getId() == null) {
            throw new IllegalArgumentException("La localidad debe tener un ID válido.");
        }

        Localidad localidad = localidadRepository.findById(domicilioRequest.getLocalidad().getId())
                .orElseThrow(() -> new EntityNotFoundException("Localidad no encontrada"));

        Domicilio domicilio = domicilioRequest.getId() != null ?
                domicilioRepository.findById(domicilioRequest.getId())
                        .map(existing -> {
                            existing.setCalle(domicilioRequest.getCalle());
                            existing.setNumero(domicilioRequest.getNumero());
                            existing.setCodigoPostal(domicilioRequest.getCodigoPostal());
                            existing.setReferencia(domicilioRequest.getReferencia());
                            existing.setLocalidad(localidad);
                            return existing;
                        }).orElseThrow(() -> new EntityNotFoundException("Domicilio no encontrado"))
                : domicilioRequest;

        domicilio.setLocalidad(localidad);
        Domicilio domicilioGuardado = domicilioRepository.save(domicilio);
        cliente.getDomicilios().add(domicilioGuardado);
        clienteRepository.save(cliente);

        return domicilioGuardado;
    }




    @Override
    public Cliente save(Cliente entity) {
        // Redirigir al método especializado
        return saveWithRelatedEntities(entity);
    }
}