package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.CompanyDTO;
import com.bidbridge.backend.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies")
@Tag(name = "Companies", description = "Şirket yönetimi işlemleri")
@SecurityRequirement(name = "bearerAuth")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    @Operation(summary = "Tüm şirketleri listele", description = "Sistemdeki tüm şirketleri listeler")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Şirket detayını getir", description = "Belirtilen ID'ye sahip şirketin detaylarını getirir")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable UUID id) {
        return ResponseEntity.ok(companyService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Yeni şirket oluştur", description = "Sisteme yeni bir şirket ekler")
    public ResponseEntity<CompanyDTO> createCompany(@Valid @RequestBody CompanyDTO companyDTO) {
        return new ResponseEntity<>(companyService.create(companyDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Şirket bilgilerini güncelle", description = "Belirtilen ID'ye sahip şirketin bilgilerini günceller")
    public ResponseEntity<CompanyDTO> updateCompany(
            @PathVariable UUID id, 
            @Valid @RequestBody CompanyDTO companyDTO) {
        companyDTO.setId(id);
        return ResponseEntity.ok(companyService.update(companyDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Şirket sil", description = "Belirtilen ID'ye sahip şirketi sistemden siler")
    public ResponseEntity<Void> deleteCompany(@PathVariable UUID id) {
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Mevcut kullanıcının şirketini getir", description = "Token'da bulunan kullanıcının şirketini döndürür")
    public ResponseEntity<CompanyDTO> getCurrentUserCompany() {
        // SecurityContextHolder'dan profile ID'sini al (Supabase Auth)
        String profileId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return ResponseEntity.ok(companyService.findByProfileId(UUID.fromString(profileId)));
    }
} 