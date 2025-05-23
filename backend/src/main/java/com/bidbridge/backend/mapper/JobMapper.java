package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.JobDTO;
import com.bidbridge.backend.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, 
        uses = {CompanyMapper.class, IncotermMapper.class, ShippingMethodMapper.class, 
                LoadingPlaceMapper.class, PortMapper.class, LoadingStyleMapper.class})
public interface JobMapper {
    
    @Mapping(source = "incoterm.id", target = "incotermId")
    @Mapping(source = "incoterm.name", target = "incotermName")
    @Mapping(source = "shippingMethod.id", target = "shippingMethodId")
    @Mapping(source = "shippingMethod.name", target = "shippingMethodName")
    @Mapping(source = "loadingPlace.id", target = "loadingPlaceId")
    @Mapping(source = "loadingPlace.name", target = "loadingPlaceName")
    @Mapping(source = "port.id", target = "portId")
    @Mapping(source = "port.name", target = "portName")
    @Mapping(source = "loadingStyle.id", target = "loadingStyleId")
    @Mapping(source = "loadingStyle.name", target = "loadingStyleName")
    @Mapping(source = "ownerCompany.id", target = "ownerCompanyId")
    @Mapping(source = "ownerCompany.name", target = "ownerCompanyName")
    JobDTO toDTO(Job job);
    
    List<JobDTO> toDTOList(List<Job> jobs);
    
    @Mapping(source = "incotermId", target = "incoterm.id")
    @Mapping(source = "shippingMethodId", target = "shippingMethod.id")
    @Mapping(source = "loadingPlaceId", target = "loadingPlace.id")
    @Mapping(source = "portId", target = "port.id")
    @Mapping(source = "loadingStyleId", target = "loadingStyle.id")
    @Mapping(source = "ownerCompanyId", target = "ownerCompany.id")
    Job toEntity(JobDTO dto);
} 