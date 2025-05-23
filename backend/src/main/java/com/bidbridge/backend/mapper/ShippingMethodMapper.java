package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.ShippingMethodDTO;
import com.bidbridge.backend.entity.ShippingMethod;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface ShippingMethodMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    ShippingMethodDTO toDTO(ShippingMethod shippingMethod);
    
    List<ShippingMethodDTO> toDTOList(List<ShippingMethod> shippingMethods);
    
    @Mapping(source = "companyId", target = "company.id")
    ShippingMethod toEntity(ShippingMethodDTO dto);
} 