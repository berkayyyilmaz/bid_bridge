
package com.bidbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name = "companies", schema = "public")
public class Company {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private Instant createdAt;
}
