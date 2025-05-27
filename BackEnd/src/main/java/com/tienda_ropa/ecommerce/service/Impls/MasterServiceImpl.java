package com.tienda_ropa.ecommerce.service.Impls;

import com.tienda_ropa.ecommerce.model.Master;
import com.tienda_ropa.ecommerce.repository.MasterRepository;
import com.tienda_ropa.ecommerce.service.MasterService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;

public abstract class MasterServiceImpl <E extends Master, ID extends Serializable> implements MasterService<E, ID> {

    protected final MasterRepository<E, ID> masterRepository;
    private static final Logger logger = LoggerFactory.getLogger(MasterServiceImpl.class);

    public MasterServiceImpl(MasterRepository<E, ID> masterRepository) {
        this.masterRepository = masterRepository;
    }

    @Override
    @Transactional
    public E save(E entity) {
        E saved = masterRepository.save(entity);
        logger.info("Entidad guardada: {}", saved);
        return saved;
    }

    @Override
    @Transactional
    public E getById(ID id) {
        return masterRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Entidad no encontrada con id: {}", id);
                    return new EntityNotFoundException("Entidad no encontrada con id: " + id);
                });
    }

    @Override
    @Transactional
    public List<E> getAll() {
        List<E> entities = masterRepository.findAllByEliminadoFalse();
        logger.info("Entidades obtenidas (no eliminadas): {}", entities.size());
        return entities;
    }

    @Override
    @Transactional
    public Page<E> getAll(Pageable pageable) {
        Page<E> entities = masterRepository.findAllByEliminadoFalse(pageable);
        logger.info("Página obtenida: {} elementos", entities.getNumberOfElements());
        return entities;
    }

    @Override
    @Transactional
    public E update(ID id, E entity) {
        if (!masterRepository.existsById(id)) {
            logger.warn("Intento de actualizar entidad inexistente con id: {}", id);
            throw new EntityNotFoundException("No existe una entidad con id: " + id);
        }

        entity.setId((Long) id);
        E updated = masterRepository.save(entity);
        logger.info("Entidad actualizada: {}", updated);
        return updated;
    }

    @Override
    @Transactional
    public void delete(ID id) {
        E entity = masterRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la entidad con id: " + id));

        entity.setEliminado(true);
        masterRepository.save(entity);
        logger.info("Entidad eliminada lógicamente: {}", entity);
    }

    // Devuelve todas las entidades, sin importar si están eliminadas
    @Override
    @Transactional
    public List<E> getAllIncludingDeleted() {
        List<E> all = masterRepository.findAll();
        logger.info("Entidades obtenidas (todas, incluidas eliminadas): {}", all.size());
        return all;
    }

    // Restaura una entidad marcada como eliminada (alta lógica)
    @Override
    @Transactional
    public void restore(ID id) {
        if (!masterRepository.existsById(id)) {
            logger.warn("Intento de restaurar entidad inexistente con id: {}", id);
            throw new EntityNotFoundException("No existe una entidad con id: " + id);
        }

        masterRepository.altaLogica(id);
        logger.info("Entidad restaurada (eliminado = false), id: {}", id);
    }
}
