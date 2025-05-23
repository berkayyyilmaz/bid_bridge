package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class UserDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String role;
    private UUID companyId;
    private String companyName;
    private Instant createdAt;
} 