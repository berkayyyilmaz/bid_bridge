package com.bidbridge.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class JobDTO {
    private UUID id;
    private String title;
    
    private UUID incotermId;
    private String incotermName;
    
    private UUID shippingMethodId;
    private String shippingMethodName;
    
    private UUID loadingPlaceId;
    private String loadingPlaceName;
    
    private UUID portId;
    private String portName;
    
    private LocalDate loadingDate;
    
    private UUID loadingStyleId;
    private String loadingStyleName;
    
    private String estimatedAnnualTonnage;
    private String address;
    private String note;
    
    private UUID ownerCompanyId;
    private String ownerCompanyName;
    
    private Instant createdAt;
} 