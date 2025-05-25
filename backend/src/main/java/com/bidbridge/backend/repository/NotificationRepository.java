package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByProfileId(UUID profileId);
    List<Notification> findByProfileIdAndIsRead(UUID profileId, boolean isRead);
} 