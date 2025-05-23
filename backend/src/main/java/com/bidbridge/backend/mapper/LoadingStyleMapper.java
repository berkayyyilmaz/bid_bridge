package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.LoadingStyleDTO;
import com.bidbridge.backend.entity.LoadingStyle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface LoadingStyleMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    LoadingStyleDTO toDTO(LoadingStyle loadingStyle);
    
    List<LoadingStyleDTO> toDTOList(List<LoadingStyle> loadingStyles);
    
    @Mapping(source = "companyId", target = "company.id")
    LoadingStyle toEntity(LoadingStyleDTO dto);
} 