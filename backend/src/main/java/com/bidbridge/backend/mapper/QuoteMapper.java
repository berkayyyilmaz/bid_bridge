package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.QuoteDTO;
import com.bidbridge.backend.entity.Quote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class, JobMapper.class})
public interface QuoteMapper {
    
    @Mapping(source = "job.id", target = "jobId")
    @Mapping(source = "job.title", target = "jobTitle")
    @Mapping(source = "offeringCompany.id", target = "offeringCompanyId")
    @Mapping(source = "offeringCompany.name", target = "offeringCompanyName")
    QuoteDTO toDTO(Quote quote);
    
    List<QuoteDTO> toDTOList(List<Quote> quotes);
    
    @Mapping(source = "jobId", target = "job.id")
    @Mapping(source = "offeringCompanyId", target = "offeringCompany.id")
    Quote toEntity(QuoteDTO dto);
} 