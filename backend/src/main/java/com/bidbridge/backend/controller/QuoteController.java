package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.QuoteDTO;
import com.bidbridge.backend.service.QuoteService;
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
@RequestMapping("/quotes")
@Tag(name = "Quotes", description = "Teklif yönetimi işlemleri")
@SecurityRequirement(name = "bearerAuth")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping
    @Operation(summary = "Tüm teklifleri listele", description = "Sistemdeki tüm teklifleri listeler")
    public ResponseEntity<List<QuoteDTO>> getAllQuotes() {
        return ResponseEntity.ok(quoteService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Teklif detayını getir", description = "Belirtilen ID'ye sahip teklifin detaylarını getirir")
    public ResponseEntity<QuoteDTO> getQuoteById(@PathVariable UUID id) {
        return ResponseEntity.ok(quoteService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Yeni teklif oluştur", description = "Sisteme yeni bir teklif ekler")
    public ResponseEntity<QuoteDTO> createQuote(@Valid @RequestBody QuoteDTO quoteDTO) {
        return new ResponseEntity<>(quoteService.create(quoteDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Teklif bilgilerini güncelle", description = "Belirtilen ID'ye sahip teklifin bilgilerini günceller")
    public ResponseEntity<QuoteDTO> updateQuote(
            @PathVariable UUID id, 
            @Valid @RequestBody QuoteDTO quoteDTO) {
        quoteDTO.setId(id);
        return ResponseEntity.ok(quoteService.update(quoteDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Teklif sil", description = "Belirtilen ID'ye sahip teklifi sistemden siler")
    public ResponseEntity<Void> deleteQuote(@PathVariable UUID id) {
        quoteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-job/{jobId}")
    @Operation(summary = "İşe göre teklifleri getir", description = "Belirtilen işe ait tüm teklifleri listeler")
    public ResponseEntity<List<QuoteDTO>> getQuotesByJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(quoteService.findByJobId(jobId));
    }

    @GetMapping("/by-company/{companyId}")
    @Operation(summary = "Şirkete göre teklifleri getir", description = "Belirtilen şirketin verdiği tüm teklifleri listeler")
    public ResponseEntity<List<QuoteDTO>> getQuotesByCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(quoteService.findByOfferingCompanyId(companyId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Teklif durumunu güncelle", description = "Belirtilen teklifin durumunu günceller")
    public ResponseEntity<QuoteDTO> updateQuoteStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(quoteService.updateStatus(id, status));
    }
} 