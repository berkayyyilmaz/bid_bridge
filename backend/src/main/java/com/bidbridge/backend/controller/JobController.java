package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.JobDTO;
import com.bidbridge.backend.service.JobService;
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
@RequestMapping("/jobs")
@Tag(name = "Jobs", description = "İş ilanları yönetimi")
@SecurityRequirement(name = "bearerAuth")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Tüm iş ilanlarını listele", description = "Sistemdeki tüm iş ilanlarını listeler")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "İş detayını getir", description = "Belirtilen ID'ye sahip iş ilanının detaylarını getirir")
    public ResponseEntity<JobDTO> getJobById(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Yeni iş ilanı oluştur", description = "Sisteme yeni bir iş ilanı ekler")
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobDTO jobDTO) {
        return new ResponseEntity<>(jobService.create(jobDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "İş ilanı bilgilerini güncelle", description = "Belirtilen ID'ye sahip iş ilanının bilgilerini günceller")
    public ResponseEntity<JobDTO> updateJob(
            @PathVariable UUID id, 
            @Valid @RequestBody JobDTO jobDTO) {
        jobDTO.setId(id);
        return ResponseEntity.ok(jobService.update(jobDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "İş ilanı sil", description = "Belirtilen ID'ye sahip iş ilanını sistemden siler")
    public ResponseEntity<Void> deleteJob(@PathVariable UUID id) {
        jobService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-company/{companyId}")
    @Operation(summary = "Şirkete göre iş ilanlarını getir", description = "Belirtilen şirkete ait tüm iş ilanlarını listeler")
    public ResponseEntity<List<JobDTO>> getJobsByCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(jobService.findByOwnerCompanyId(companyId));
    }
} 