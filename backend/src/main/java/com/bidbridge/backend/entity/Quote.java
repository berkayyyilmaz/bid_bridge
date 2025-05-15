
package com.bidbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.time.LocalDate;
import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name = "quotes", schema = "public")
public class Quote {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "offering_company_id")
    private Company offeringCompany;

    private Double price;
    private String currency;
    private Integer transitTime;
    private LocalDate validUntil;

    private String note;
    private String address;
    private String status;

    private Instant createdAt;
}
