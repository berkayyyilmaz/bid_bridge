package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.LoadingStyle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoadingStyleRepository extends JpaRepository<LoadingStyle, UUID> {
    List<LoadingStyle> findByCompanyId(UUID companyId);
} 