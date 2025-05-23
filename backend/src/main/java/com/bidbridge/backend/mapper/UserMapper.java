package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.UserDTO;
import com.bidbridge.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {CompanyMapper.class})
public interface UserMapper {
    
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    UserDTO toDTO(User user);
    
    List<UserDTO> toDTOList(List<User> users);
    
    @Mapping(source = "companyId", target = "company.id")
    User toEntity(UserDTO dto);
} 