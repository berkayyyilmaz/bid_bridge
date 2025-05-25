package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.ProfileDTO;

import java.util.List;
import java.util.UUID;

public interface ProfileService extends BaseService<ProfileDTO, UUID> {
    List<ProfileDTO> findByCompanyId(UUID companyId);
    List<ProfileDTO> findByRole(String role);
} 