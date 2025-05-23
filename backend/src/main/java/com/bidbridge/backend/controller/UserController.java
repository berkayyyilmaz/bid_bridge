package com.bidbridge.backend.controller;

import com.bidbridge.backend.dto.UserDTO;
import com.bidbridge.backend.service.UserService;
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
@RequestMapping("/users")
@Tag(name = "Users", description = "Kullanıcı yönetimi işlemleri")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Tüm kullanıcıları listele", description = "Sistemdeki tüm kullanıcıları listeler")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Kullanıcı detayını getir", description = "Belirtilen ID'ye sahip kullanıcının detaylarını getirir")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Yeni kullanıcı oluştur", description = "Sisteme yeni bir kullanıcı ekler")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        return new ResponseEntity<>(userService.create(userDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Kullanıcı bilgilerini güncelle", description = "Belirtilen ID'ye sahip kullanıcının bilgilerini günceller")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable UUID id, 
            @Valid @RequestBody UserDTO userDTO) {
        userDTO.setId(id);
        return ResponseEntity.ok(userService.update(userDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Kullanıcı sil", description = "Belirtilen ID'ye sahip kullanıcıyı sistemden siler")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-company/{companyId}")
    @Operation(summary = "Şirkete göre kullanıcıları getir", description = "Belirtilen şirkete ait tüm kullanıcıları listeler")
    public ResponseEntity<List<UserDTO>> getUsersByCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(userService.findByCompanyId(companyId));
    }
} 