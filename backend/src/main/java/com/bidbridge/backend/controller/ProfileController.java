package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.ProfileDTO;
import com.bidbridge.backend.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/profiles")
@Tag(name = "Profiles", description = "Kullanıcı profil yönetimi işlemleri")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(summary = "Tüm profilleri listele", description = "Sistemdeki tüm kullanıcı profillerini listeler")
    public ResponseEntity<List<ProfileDTO>> getAllProfiles() {
        return ResponseEntity.ok(profileService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Profil detayını getir", description = "Belirtilen ID'ye sahip kullanıcı profilinin detaylarını getirir")
    public ResponseEntity<ProfileDTO> getProfileById(@PathVariable UUID id) {
        return ResponseEntity.ok(profileService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Yeni profil oluştur", description = "Sisteme yeni bir kullanıcı profili ekler")
    public ResponseEntity<ProfileDTO> createProfile(@Valid @RequestBody ProfileDTO profileDTO) {
        return new ResponseEntity<>(profileService.create(profileDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Profil bilgilerini güncelle", description = "Belirtilen ID'ye sahip kullanıcı profilinin bilgilerini günceller")
    public ResponseEntity<ProfileDTO> updateProfile(
            @PathVariable UUID id, 
            @Valid @RequestBody ProfileDTO profileDTO) {
        profileDTO.setId(id);
        return ResponseEntity.ok(profileService.update(profileDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Profil sil", description = "Belirtilen ID'ye sahip kullanıcı profilini sistemden siler")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-company/{companyId}")
    @Operation(summary = "Şirkete göre profilleri getir", description = "Belirtilen şirkete ait tüm kullanıcı profillerini listeler")
    public ResponseEntity<List<ProfileDTO>> getProfilesByCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(profileService.findByCompanyId(companyId));
    }

    @GetMapping("/by-role/{role}")
    @Operation(summary = "Role göre profilleri getir", description = "Belirtilen role sahip tüm kullanıcı profillerini listeler")
    public ResponseEntity<List<ProfileDTO>> getProfilesByRole(@PathVariable String role) {
        return ResponseEntity.ok(profileService.findByRole(role));
    }
} 