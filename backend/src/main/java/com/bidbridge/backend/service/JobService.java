package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.JobDTO;

import java.util.List;
import java.util.UUID;

public interface JobService extends BaseService<JobDTO, UUID> {
    List<JobDTO> findByOwnerCompanyId(UUID companyId);
    List<JobDTO> findByTitleContaining(String keyword);
} 