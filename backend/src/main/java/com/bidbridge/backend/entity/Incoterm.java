
package com.bidbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name = "incoterms", schema = "public")
public class Incoterm {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private Instant createdAt;
}
