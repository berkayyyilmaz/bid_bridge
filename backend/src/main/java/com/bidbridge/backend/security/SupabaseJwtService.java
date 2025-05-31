package com.bidbridge.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class SupabaseJwtService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseJwtService.class);

    @Value("${supabase.jwt.secret:your-supabase-jwt-secret}")
    private String supabaseJwtSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Supabase JWT token'ından kullanıcı ID'sini çıkarır
     */
    public String extractUserId(String token) {
        try {
            // Token'ı manuel olarak decode et (signature doğrulaması olmadan)
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                JsonNode payloadNode = objectMapper.readTree(payload);
                String userId = payloadNode.get("sub").asText();
                logger.debug("Extracted user ID: {}", userId);
                return userId;
            }
        } catch (Exception e) {
            logger.error("Error extracting user ID: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Supabase JWT token'ından email'i çıkarır
     */
    public String extractEmail(String token) {
        try {
            // Token'ı manuel olarak decode et (signature doğrulaması olmadan)
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                JsonNode payloadNode = objectMapper.readTree(payload);
                String email = payloadNode.get("email").asText();
                logger.debug("Extracted email: {}", email);
                return email;
            }
        } catch (Exception e) {
            logger.error("Error extracting email: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Supabase JWT token'ından role'ü çıkarır
     */
    public String extractRole(String token) {
        try {
            // Token'ı manuel olarak decode et (signature doğrulaması olmadan)
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                JsonNode payloadNode = objectMapper.readTree(payload);
                String role = payloadNode.get("role").asText();
                logger.debug("Extracted role: {}", role);
                return role;
            }
        } catch (Exception e) {
            logger.error("Error extracting role: {}", e.getMessage());
        }
        return "authenticated";
    }

    /**
     * Supabase JWT token'ının geçerli olup olmadığını kontrol eder
     */
    public boolean isTokenValid(String token) {
        try {
            logger.debug("Validating JWT token...");
            
            // Token'ı manuel olarak decode et ve expiry kontrol et
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                JsonNode payloadNode = objectMapper.readTree(payload);
                
                // Expiry kontrolü
                long exp = payloadNode.get("exp").asLong();
                long currentTime = System.currentTimeMillis() / 1000;
                
                if (exp < currentTime) {
                    logger.warn("Token expired");
                    return false;
                }
                
                // Issuer kontrolü
                String issuer = payloadNode.get("iss").asText();
                if (!issuer.contains("supabase")) {
                    logger.warn("Invalid issuer: {}", issuer);
                    return false;
                }
                
                logger.debug("Token validation successful (manual decode)");
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * JWT token'ından tüm claims'leri çıkarır
     */
    private Claims extractAllClaims(String token) {
        logger.debug("Extracting claims from token...");
        logger.debug("Using JWT secret (first 10 chars): {}", supabaseJwtSecret.substring(0, Math.min(10, supabaseJwtSecret.length())));
        
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Supabase JWT secret'ından signing key oluşturur
     */
    private Key getSignInKey() {
        // Supabase JWT secret genellikle base64 encoded'dır
        byte[] keyBytes;
        try {
            // Base64 decode dene
            keyBytes = Base64.getDecoder().decode(supabaseJwtSecret);
            logger.debug("JWT secret decoded from base64");
        } catch (IllegalArgumentException e) {
            // Base64 değilse direkt kullan
            keyBytes = supabaseJwtSecret.getBytes(StandardCharsets.UTF_8);
            logger.debug("JWT secret used as plain text");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * JWT token'ının header'ından algorithm bilgisini alır
     */
    public String getTokenAlgorithm(String token) {
        try {
            String[] chunks = token.split("\\.");
            if (chunks.length < 2) {
                return null;
            }
            
            String header = new String(Base64.getUrlDecoder().decode(chunks[0]));
            JsonNode headerNode = objectMapper.readTree(header);
            return headerNode.get("alg").asText();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * JWT token'ının payload'ından user metadata'sını alır
     */
    public JsonNode getUserMetadata(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object userMetadata = claims.get("user_metadata");
            if (userMetadata != null) {
                return objectMapper.valueToTree(userMetadata);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * JWT token'ının payload'ından app metadata'sını alır
     */
    public JsonNode getAppMetadata(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object appMetadata = claims.get("app_metadata");
            if (appMetadata != null) {
                return objectMapper.valueToTree(appMetadata);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
} 