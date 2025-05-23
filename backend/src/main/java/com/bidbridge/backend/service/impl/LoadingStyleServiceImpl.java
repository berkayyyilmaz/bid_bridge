package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.LoadingStyleDTO;
import com.bidbridge.backend.entity.LoadingStyle;
import com.bidbridge.backend.mapper.LoadingStyleMapper;
import com.bidbridge.backend.repository.LoadingStyleRepository;
import com.bidbridge.backend.service.LoadingStyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoadingStyleServiceImpl extends AbstractReferenceDataServiceImpl<LoadingStyle, LoadingStyleDTO, LoadingStyleRepository>
        implements LoadingStyleService {

    @Autowired
    public LoadingStyleServiceImpl(LoadingStyleRepository repository, LoadingStyleMapper mapper) {
        super(
            repository,
            mapper::toDTO,
            mapper::toDTOList,
            mapper::toEntity,
            repository::findByCompanyId
        );
    }
} 