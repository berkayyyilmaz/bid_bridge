package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.NotificationDTO;
import com.bidbridge.backend.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {UserMapper.class})
public interface NotificationMapper {
    
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    NotificationDTO toDTO(Notification notification);
    
    List<NotificationDTO> toDTOList(List<Notification> notifications);
    
    @Mapping(source = "userId", target = "user.id")
    Notification toEntity(NotificationDTO dto);
} 