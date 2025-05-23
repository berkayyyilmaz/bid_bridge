package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class LoadingStyleDTO {
    private UUID id;
    private String name;
    private UUID companyId;
    private String companyName;
    private Instant createdAt;
} 