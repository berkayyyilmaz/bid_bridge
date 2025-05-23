package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.*;
import com.bidbridge.backend.service.*;
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
@Tag(name = "Reference Data", description = "Referans veri yönetimi")
@SecurityRequirement(name = "bearerAuth")
public class ReferenceDataController {

    private final IncotermService incotermService;
    private final ShippingMethodService shippingMethodService;
    private final LoadingPlaceService loadingPlaceService;
    private final PortService portService;
    private final LoadingStyleService loadingStyleService;

    public ReferenceDataController(
            IncotermService incotermService,
            ShippingMethodService shippingMethodService,
            LoadingPlaceService loadingPlaceService,
            PortService portService,
            LoadingStyleService loadingStyleService) {
        this.incotermService = incotermService;
        this.shippingMethodService = shippingMethodService;
        this.loadingPlaceService = loadingPlaceService;
        this.portService = portService;
        this.loadingStyleService = loadingStyleService;
    }

    // Incoterms
    @GetMapping("/api/incoterms")
    @Operation(summary = "Tüm incotermleri listele", description = "Tüm incoterm seçeneklerini listeler")
    public ResponseEntity<List<IncotermDTO>> getAllIncoterms() {
        return ResponseEntity.ok(incotermService.findAll());
    }

    @GetMapping("/api/incoterms/{id}")
    @Operation(summary = "Incoterm detayını getir", description = "Belirtilen incoterm detayını getirir")
    public ResponseEntity<IncotermDTO> getIncotermById(@PathVariable UUID id) {
        return ResponseEntity.ok(incotermService.findById(id));
    }

    @PostMapping("/api/incoterms")
    @Operation(summary = "Yeni incoterm oluştur", description = "Yeni bir incoterm ekler")
    public ResponseEntity<IncotermDTO> createIncoterm(@Valid @RequestBody IncotermDTO dto) {
        return new ResponseEntity<>(incotermService.create(dto), HttpStatus.CREATED);
    }

    // Shipping Methods
    @GetMapping("/api/shipping-methods")
    @Operation(summary = "Tüm taşıma yöntemlerini listele", description = "Tüm taşıma yöntemi seçeneklerini listeler")
    public ResponseEntity<List<ShippingMethodDTO>> getAllShippingMethods() {
        return ResponseEntity.ok(shippingMethodService.findAll());
    }

    @GetMapping("/api/shipping-methods/{id}")
    @Operation(summary = "Taşıma yöntemi detayını getir", description = "Belirtilen taşıma yöntemi detayını getirir")
    public ResponseEntity<ShippingMethodDTO> getShippingMethodById(@PathVariable UUID id) {
        return ResponseEntity.ok(shippingMethodService.findById(id));
    }

    @PostMapping("/api/shipping-methods")
    @Operation(summary = "Yeni taşıma yöntemi oluştur", description = "Yeni bir taşıma yöntemi ekler")
    public ResponseEntity<ShippingMethodDTO> createShippingMethod(@Valid @RequestBody ShippingMethodDTO dto) {
        return new ResponseEntity<>(shippingMethodService.create(dto), HttpStatus.CREATED);
    }

    // Loading Places
    @GetMapping("/api/loading-places")
    @Operation(summary = "Tüm yükleme yerlerini listele", description = "Tüm yükleme yeri seçeneklerini listeler")
    public ResponseEntity<List<LoadingPlaceDTO>> getAllLoadingPlaces() {
        return ResponseEntity.ok(loadingPlaceService.findAll());
    }

    @GetMapping("/api/loading-places/{id}")
    @Operation(summary = "Yükleme yeri detayını getir", description = "Belirtilen yükleme yeri detayını getirir")
    public ResponseEntity<LoadingPlaceDTO> getLoadingPlaceById(@PathVariable UUID id) {
        return ResponseEntity.ok(loadingPlaceService.findById(id));
    }

    @PostMapping("/api/loading-places")
    @Operation(summary = "Yeni yükleme yeri oluştur", description = "Yeni bir yükleme yeri ekler")
    public ResponseEntity<LoadingPlaceDTO> createLoadingPlace(@Valid @RequestBody LoadingPlaceDTO dto) {
        return new ResponseEntity<>(loadingPlaceService.create(dto), HttpStatus.CREATED);
    }

    // Ports
    @GetMapping("/api/ports")
    @Operation(summary = "Tüm limanları listele", description = "Tüm liman seçeneklerini listeler")
    public ResponseEntity<List<PortDTO>> getAllPorts() {
        return ResponseEntity.ok(portService.findAll());
    }

    @GetMapping("/api/ports/{id}")
    @Operation(summary = "Liman detayını getir", description = "Belirtilen liman detayını getirir")
    public ResponseEntity<PortDTO> getPortById(@PathVariable UUID id) {
        return ResponseEntity.ok(portService.findById(id));
    }

    @PostMapping("/api/ports")
    @Operation(summary = "Yeni liman oluştur", description = "Yeni bir liman ekler")
    public ResponseEntity<PortDTO> createPort(@Valid @RequestBody PortDTO dto) {
        return new ResponseEntity<>(portService.create(dto), HttpStatus.CREATED);
    }

    // Loading Styles
    @GetMapping("/api/loading-styles")
    @Operation(summary = "Tüm yükleme şekillerini listele", description = "Tüm yükleme şekli seçeneklerini listeler")
    public ResponseEntity<List<LoadingStyleDTO>> getAllLoadingStyles() {
        return ResponseEntity.ok(loadingStyleService.findAll());
    }

    @GetMapping("/api/loading-styles/{id}")
    @Operation(summary = "Yükleme şekli detayını getir", description = "Belirtilen yükleme şekli detayını getirir")
    public ResponseEntity<LoadingStyleDTO> getLoadingStyleById(@PathVariable UUID id) {
        return ResponseEntity.ok(loadingStyleService.findById(id));
    }

    @PostMapping("/api/loading-styles")
    @Operation(summary = "Yeni yükleme şekli oluştur", description = "Yeni bir yükleme şekli ekler")
    public ResponseEntity<LoadingStyleDTO> createLoadingStyle(@Valid @RequestBody LoadingStyleDTO dto) {
        return new ResponseEntity<>(loadingStyleService.create(dto), HttpStatus.CREATED);
    }
} 