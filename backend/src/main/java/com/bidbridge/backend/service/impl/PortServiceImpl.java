package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.PortDTO;
import com.bidbridge.backend.entity.Port;
import com.bidbridge.backend.mapper.PortMapper;
import com.bidbridge.backend.repository.PortRepository;
import com.bidbridge.backend.service.PortService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PortServiceImpl extends AbstractReferenceDataServiceImpl<Port, PortDTO, PortRepository>
        implements PortService {

    @Autowired
    public PortServiceImpl(PortRepository repository, PortMapper mapper) {
        super(
            repository,
            mapper::toDTO,
            mapper::toDTOList,
            mapper::toEntity,
            repository::findByCompanyId
        );
    }
} 