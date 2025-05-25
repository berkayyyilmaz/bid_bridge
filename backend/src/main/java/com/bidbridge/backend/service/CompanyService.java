package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.CompanyDTO;

import java.util.UUID;

public interface CompanyService extends BaseService<CompanyDTO, UUID> {
    CompanyDTO findByName(String name);
    CompanyDTO findByProfileId(UUID profileId);
} 