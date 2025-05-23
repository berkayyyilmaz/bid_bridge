package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.IncotermDTO;
import com.bidbridge.backend.entity.Incoterm;
import com.bidbridge.backend.mapper.IncotermMapper;
import com.bidbridge.backend.repository.IncotermRepository;
import com.bidbridge.backend.service.IncotermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IncotermServiceImpl extends AbstractReferenceDataServiceImpl<Incoterm, IncotermDTO, IncotermRepository>
        implements IncotermService {

    @Autowired
    public IncotermServiceImpl(IncotermRepository repository, IncotermMapper mapper) {
        super(
            repository,
            mapper::toDTO,
            mapper::toDTOList,
            mapper::toEntity,
            repository::findByCompanyId
        );
    }
} 