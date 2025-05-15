
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
@Table(name = "jobs", schema = "public")
public class Job {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "incoterm_id")
    private Incoterm incoterm;

    @ManyToOne
    @JoinColumn(name = "shipping_method_id")
    private ShippingMethod shippingMethod;

    @ManyToOne
    @JoinColumn(name = "loading_place_id")
    private LoadingPlace loadingPlace;

    @ManyToOne
    @JoinColumn(name = "port_id")
    private Port port;

    private LocalDate loadingDate;

    @ManyToOne
    @JoinColumn(name = "loading_style_id")
    private LoadingStyle loadingStyle;

    private String estimatedAnnualTonnage;
    private String address;
    private String note;

    @ManyToOne
    @JoinColumn(name = "owner_company_id")
    private Company ownerCompany;

    private Instant createdAt;
}
