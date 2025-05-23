package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByOwnerCompanyId(UUID companyId);
    List<Job> findByTitleContaining(String keyword);
} 