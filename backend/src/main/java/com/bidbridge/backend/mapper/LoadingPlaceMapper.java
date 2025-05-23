package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.LoadingPlaceDTO;
import com.bidbridge.backend.entity.LoadingPlace;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface LoadingPlaceMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    LoadingPlaceDTO toDTO(LoadingPlace loadingPlace);
    
    List<LoadingPlaceDTO> toDTOList(List<LoadingPlace> loadingPlaces);
    
    @Mapping(source = "companyId", target = "company.id")
    LoadingPlace toEntity(LoadingPlaceDTO dto);
} 