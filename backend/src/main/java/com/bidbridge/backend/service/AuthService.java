package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.LoginRequestDTO;
import com.bidbridge.backend.dto.LoginResponseDTO;
import com.bidbridge.backend.dto.RegisterRequestDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequest);
    LoginResponseDTO register(RegisterRequestDTO registerRequest);
} 