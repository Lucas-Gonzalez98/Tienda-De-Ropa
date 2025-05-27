package com.tienda_ropa.ecommerce.controller;

import com.tienda_ropa.ecommerce.model.Master;
import com.tienda_ropa.ecommerce.service.MasterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;

public abstract class MasterController<E extends Master, ID extends Serializable> {

    protected final MasterService<E, ID> service;

    public MasterController(MasterService<E, ID> service) {
        this.service = service;
    }

    // Guardar una nueva entidad
    @PostMapping
    public ResponseEntity<E> create(@RequestBody E entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<E> getById(@PathVariable ID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // Listar todas las entidades no eliminadas
    @GetMapping
    public ResponseEntity<List<E>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Listar todas las entidades (incluyendo eliminadas)
    @GetMapping("/all")
    public ResponseEntity<List<E>> getAllIncludingDeleted() {
        return ResponseEntity.ok(service.getAllIncludingDeleted());
    }

    // Obtener todas con paginación
    @GetMapping("/page")
    public ResponseEntity<Page<E>> getAllPaged(Pageable pageable) {
        return ResponseEntity.ok(service.getAll(pageable));
    }

    // Actualizar una entidad
    @PutMapping("/{id}")
    public ResponseEntity<E> update(@PathVariable ID id, @RequestBody E entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Baja lógica
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Alta lógica (restaurar entidad eliminada)
    @PutMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable ID id) {
        service.restore(id);
        return ResponseEntity.ok().build();
    }
}
