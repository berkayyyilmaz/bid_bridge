package com.bidbridge.backend.mapper;

import com.bidbridge.backend.dto.NotificationDTO;
import com.bidbridge.backend.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface NotificationMapper {
    
    @Mapping(source = "profile.id", target = "profileId")
    NotificationDTO toDTO(Notification notification);
    
    List<NotificationDTO> toDTOList(List<Notification> notifications);
    
    @Mapping(source = "profileId", target = "profile.id")
    Notification toEntity(NotificationDTO dto);
} 