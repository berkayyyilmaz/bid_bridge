package com.bidbridge.backend.service;

import com.bidbridge.backend.dto.ProfileDTO;
import java.util.UUID;

public interface AuthService {
    ProfileDTO createProfileFromSupabaseUser(UUID supabaseProfileId, String role, UUID companyId);
    ProfileDTO getCurrentUserProfile(UUID supabaseProfileId);
} 