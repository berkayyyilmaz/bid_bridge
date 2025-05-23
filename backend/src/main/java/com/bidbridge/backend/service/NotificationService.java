package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.NotificationDTO;

import java.util.List;
import java.util.UUID;

public interface NotificationService extends BaseService<NotificationDTO, UUID> {
    List<NotificationDTO> findByUserId(UUID userId);
    List<NotificationDTO> findByUserIdAndIsRead(UUID userId, boolean isRead);
} 