package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CompanyDTO {
    private UUID id;
    private String name;
    private Instant createdAt;
} 