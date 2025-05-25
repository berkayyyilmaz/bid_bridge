package com.bidbridge.backend.service.impl;

import com.bidbridge.backend.dto.ProfileDTO;
import com.bidbridge.backend.entity.Company;
import com.bidbridge.backend.entity.Profile;
import com.bidbridge.backend.repository.CompanyRepository;
import com.bidbridge.backend.repository.ProfileRepository;
import com.bidbridge.backend.service.AuthService;
import com.bidbridge.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final ProfileService profileService;
    private final CompanyRepository companyRepository;
    
    @Autowired
    public AuthServiceImpl(ProfileService profileService, CompanyRepository companyRepository) {
        this.profileService = profileService;
        this.companyRepository = companyRepository;
    }

    @Override
    public ProfileDTO createProfileFromSupabaseUser(UUID supabaseProfileId, String role, UUID companyId) {
        // Check if profile already exists
        try {
            return profileService.findById(supabaseProfileId);
        } catch (RuntimeException e) {
            // Profile doesn't exist, create new one
        }
        
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setId(supabaseProfileId);
        profileDTO.setRole(role);
        profileDTO.setCompanyId(companyId);
        
        return profileService.create(profileDTO);
    }

    @Override
    public ProfileDTO getCurrentUserProfile(UUID supabaseProfileId) {
        return profileService.findById(supabaseProfileId);
    }
} 