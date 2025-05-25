package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.NotificationDTO;

import java.util.List;
import java.util.UUID;

public interface NotificationService extends BaseService<NotificationDTO, UUID> {
    List<NotificationDTO> findByProfileId(UUID profileId);
    List<NotificationDTO> findByProfileIdAndIsRead(UUID profileId, boolean isRead);
} 