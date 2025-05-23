package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.CompanyDTO;
import com.bidbridge.backend.entity.Company;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CompanyMapper {
    
    CompanyDTO toDTO(Company company);
    
    List<CompanyDTO> toDTOList(List<Company> companies);
    
    Company toEntity(CompanyDTO dto);
} 