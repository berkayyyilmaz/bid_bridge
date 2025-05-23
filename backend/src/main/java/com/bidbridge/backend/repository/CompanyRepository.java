package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    // Basic CRUD operations are automatically provided by JpaRepository
    // Find by name
    Company findByName(String name);
} 