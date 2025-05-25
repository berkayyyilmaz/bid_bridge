package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.ProfileDTO;
import com.bidbridge.backend.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface ProfileMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    ProfileDTO toDTO(Profile profile);
    
    List<ProfileDTO> toDTOList(List<Profile> profiles);
    
    @Mapping(source = "companyId", target = "company.id")
    Profile toEntity(ProfileDTO dto);
} 