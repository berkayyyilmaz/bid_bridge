package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.Port;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortRepository extends JpaRepository<Port, UUID> {
    List<Port> findByCompanyId(UUID companyId);
} 