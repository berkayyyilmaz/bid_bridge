package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface UserService extends BaseService<UserDTO, UUID> {
    UserDTO findByEmail(String email);
    List<UserDTO> findByCompanyId(UUID companyId);
    boolean existsByEmail(String email);
} 