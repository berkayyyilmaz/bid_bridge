package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.PortDTO;
import com.bidbridge.backend.entity.Port;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface PortMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    PortDTO toDTO(Port port);
    
    List<PortDTO> toDTOList(List<Port> ports);
    
    @Mapping(source = "companyId", target = "company.id")
    Port toEntity(PortDTO dto);
} 