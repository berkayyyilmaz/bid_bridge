package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, UUID> {
    List<Quote> findByJobId(UUID jobId);
    List<Quote> findByOfferingCompanyId(UUID companyId);
    List<Quote> findByJobIdAndStatus(UUID jobId, String status);
} 