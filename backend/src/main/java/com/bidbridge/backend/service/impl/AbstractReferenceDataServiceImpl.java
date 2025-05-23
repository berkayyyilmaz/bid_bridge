package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.service.ReferenceDataService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;

@Transactional
public abstract class AbstractReferenceDataServiceImpl<E, D, R extends JpaRepository<E, UUID>> 
    implements ReferenceDataService<D> {

    protected final R repository;
    protected final Function<E, D> toDTO;
    protected final Function<List<E>, List<D>> toDTOList;
    protected final Function<D, E> toEntity;
    protected final Function<UUID, List<E>> findByCompanyIdFn;

    protected AbstractReferenceDataServiceImpl(
            R repository,
            Function<E, D> toDTO,
            Function<List<E>, List<D>> toDTOList,
            Function<D, E> toEntity,
            Function<UUID, List<E>> findByCompanyIdFn) {
        this.repository = repository;
        this.toDTO = toDTO;
        this.toDTOList = toDTOList;
        this.toEntity = toEntity;
        this.findByCompanyIdFn = findByCompanyIdFn;
    }

    @Override
    public D findById(UUID id) {
        return repository.findById(id)
                .map(toDTO)
                .orElseThrow(() -> new RuntimeException("Entity not found with id: " + id));
    }

    @Override
    public List<D> findAll() {
        return toDTOList.apply(repository.findAll());
    }

    @Override
    public D create(D dto) {
        E entity = toEntity.apply(dto);
        E savedEntity = repository.save(entity);
        return toDTO.apply(savedEntity);
    }

    @Override
    public D update(D dto) {
        // Implementation detail is in the specific repository
        E entity = toEntity.apply(dto);
        E updatedEntity = repository.save(entity);
        return toDTO.apply(updatedEntity);
    }

    @Override
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public List<D> findByCompanyId(UUID companyId) {
        return toDTOList.apply(findByCompanyIdFn.apply(companyId));
    }
} 