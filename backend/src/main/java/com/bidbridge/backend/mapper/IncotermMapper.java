package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.IncotermDTO;
import com.bidbridge.backend.entity.Incoterm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface IncotermMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    IncotermDTO toDTO(Incoterm incoterm);
    
    List<IncotermDTO> toDTOList(List<Incoterm> incoterms);
    
    @Mapping(source = "companyId", target = "company.id")
    Incoterm toEntity(IncotermDTO dto);
} 