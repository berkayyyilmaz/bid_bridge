package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class ProfileDTO {
    private UUID id;
    private String role;
    private UUID companyId;
    private String companyName;
    private Instant createdAt;
    private Instant updatedAt;
} 