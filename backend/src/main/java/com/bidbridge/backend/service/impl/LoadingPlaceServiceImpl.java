package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.LoadingPlaceDTO;
import com.bidbridge.backend.entity.LoadingPlace;
import com.bidbridge.backend.mapper.LoadingPlaceMapper;
import com.bidbridge.backend.repository.LoadingPlaceRepository;
import com.bidbridge.backend.service.LoadingPlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoadingPlaceServiceImpl extends AbstractReferenceDataServiceImpl<LoadingPlace, LoadingPlaceDTO, LoadingPlaceRepository>
        implements LoadingPlaceService {

    @Autowired
    public LoadingPlaceServiceImpl(LoadingPlaceRepository repository, LoadingPlaceMapper mapper) {
        super(
            repository,
            mapper::toDTO,
            mapper::toDTOList,
            mapper::toEntity,
            repository::findByCompanyId
        );
    }
} 