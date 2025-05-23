package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class QuoteDTO {
    private UUID id;
    
    private UUID jobId;
    private String jobTitle;
    
    private UUID offeringCompanyId;
    private String offeringCompanyName;
    
    private Double price;
    private String currency;
    private Integer transitTime;
    private LocalDate validUntil;
    
    private String note;
    private String address;
    private String status;
    
    private Instant createdAt;
} 