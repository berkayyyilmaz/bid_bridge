package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.QuoteDTO;

import java.util.List;
import java.util.UUID;

public interface QuoteService extends BaseService<QuoteDTO, UUID> {
    List<QuoteDTO> findByJobId(UUID jobId);
    List<QuoteDTO> findByOfferingCompanyId(UUID companyId);
    List<QuoteDTO> findByJobIdAndStatus(UUID jobId, String status);
    QuoteDTO updateStatus(UUID id, String status);
} 