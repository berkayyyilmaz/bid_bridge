package com.bidbridge.backend.service;

import java.util.List;
import java.util.UUID;

public interface ReferenceDataService<T> extends BaseService<T, UUID> {
    List<T> findByCompanyId(UUID companyId);
} 