package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.ProfileDTO;
import com.bidbridge.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Supabase Auth entegrasyonu işlemleri")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Supabase kullanıcısı için profil oluştur", description = "Supabase auth kullanıcısı için uygulama profili oluşturur")
    public ResponseEntity<Map<String, Object>> createProfile(@RequestBody Map<String, Object> request) {
        try {
            UUID userId = UUID.fromString((String) request.get("userId"));
            String companyName = (String) request.get("companyName");
            
            ProfileDTO profile = authService.createProfileFromSupabaseUser(
                userId, 
                "USER", 
                null // Company ID will be set after company creation
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "profile", profile,
                "message", "Profil başarıyla oluşturuldu"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/profile")
    @Operation(summary = "Mevcut kullanıcı profilini getir", description = "JWT token'dan kullanıcı profilini getirir")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ProfileDTO> getCurrentUserProfile() {
        try {
            // SecurityContextHolder'dan user ID'sini al (Supabase user ID)
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            ProfileDTO profile = authService.getCurrentUserProfile(UUID.fromString(userId));
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile/{profileId}")
    @Operation(summary = "Kullanıcı profilini getir", description = "Supabase profile ID'si ile kullanıcı profilini getirir")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ProfileDTO> getUserProfile(@PathVariable UUID profileId) {
        try {
            return ResponseEntity.ok(authService.getCurrentUserProfile(profileId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Token bilgilerini getir", description = "JWT token'dan kullanıcı bilgilerini döndürür")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> getTokenInfo() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            String email = (String) authentication.getCredentials();
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            
            return ResponseEntity.ok(Map.of(
                "userId", userId,
                "email", email,
                "role", role,
                "authenticated", true
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "authenticated", false,
                "error", e.getMessage()
            ));
        }
    }
} 