
package com.bidbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name = "notifications", schema = "public")
public class Notification {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String data;

    private Boolean isRead = false;
    private Instant createdAt;
}
