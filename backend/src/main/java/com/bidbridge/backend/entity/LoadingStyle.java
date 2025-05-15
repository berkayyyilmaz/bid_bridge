
package com.bidbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name = "loading_styles", schema = "public")
public class LoadingStyle {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private Instant createdAt;
}
