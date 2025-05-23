package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.ShippingMethodDTO;
import com.bidbridge.backend.entity.ShippingMethod;
import com.bidbridge.backend.mapper.ShippingMethodMapper;
import com.bidbridge.backend.repository.ShippingMethodRepository;
import com.bidbridge.backend.service.ShippingMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShippingMethodServiceImpl extends AbstractReferenceDataServiceImpl<ShippingMethod, ShippingMethodDTO, ShippingMethodRepository>
        implements ShippingMethodService {

    @Autowired
    public ShippingMethodServiceImpl(ShippingMethodRepository repository, ShippingMethodMapper mapper) {
        super(
            repository,
            mapper::toDTO,
            mapper::toDTOList,
            mapper::toEntity,
            repository::findByCompanyId
        );
    }
} 