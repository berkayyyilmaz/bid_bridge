package com.bidbridge.backend.repository;

import com.bidbridge.backend.entity.LoadingPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoadingPlaceRepository extends JpaRepository<LoadingPlace, UUID> {
    List<LoadingPlace> findByCompanyId(UUID companyId);
} 