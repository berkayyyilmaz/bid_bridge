package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class NotificationDTO {
    private UUID id;
    private UUID profileId;
    private String type;
    private String data;
    private boolean isRead;
    private Instant createdAt;
} 