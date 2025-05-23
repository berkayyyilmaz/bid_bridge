package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.LoginRequestDTO;
import com.bidbridge.backend.dto.LoginResponseDTO;
import com.bidbridge.backend.dto.RegisterRequestDTO;
import com.bidbridge.backend.entity.Company;
import com.bidbridge.backend.entity.User;
import com.bidbridge.backend.repository.CompanyRepository;
import com.bidbridge.backend.repository.UserRepository;
import com.bidbridge.backend.security.JwtService;
import com.bidbridge.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                          CompanyRepository companyRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Geçersiz kullanıcı adı veya şifre"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Geçersiz kullanıcı adı veya şifre");
        }
        
        return generateLoginResponse(user);
    }

    @Override
    @Transactional
    public LoginResponseDTO register(RegisterRequestDTO registerRequest) {
        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Bu email adresi zaten kullanımda");
        }

        try {
            // Create company
            Company company = new Company();
            company.setName(registerRequest.getCompanyName());
            company = companyRepository.save(company);

            // Create user
            User user = new User();
            user.setEmail(registerRequest.getEmail());
            user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
            user.setFullName(registerRequest.getFullName());
            user.setRole("ADMIN"); // First user of company is admin
            user.setCompany(company);
            user = userRepository.save(user);

            return generateLoginResponse(user);
        } catch (Exception e) {
            throw new RuntimeException("Kullanıcı kaydı sırasında bir hata oluştu: " + e.getMessage());
        }
    }

    private LoginResponseDTO generateLoginResponse(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        claims.put("role", user.getRole());
        if (user.getCompany() != null) {
            claims.put("companyId", user.getCompany().getId().toString());
        }
        
        String token = jwtService.generateToken(claims, user.getEmail());
        
        return LoginResponseDTO.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .build();
    }
} 