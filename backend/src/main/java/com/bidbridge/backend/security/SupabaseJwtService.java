package com.bidbridge.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class SupabaseJwtService {

    @Value("${supabase.jwt.secret:your-supabase-jwt-secret}")
    private String supabaseJwtSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Supabase JWT token'ından kullanıcı ID'sini çıkarır
     */
    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("sub", String.class));
    }

    /**
     * Supabase JWT token'ından email'i çıkarır
     */
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    /**
     * Supabase JWT token'ından role'ü çıkarır
     */
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /**
     * JWT token'ından belirli bir claim'i çıkarır
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Supabase JWT token'ının geçerli olup olmadığını kontrol eder
     */
    public boolean isTokenValid(String token) {
        try {
            // Token'ı parse et ve geçerlilik kontrolü yap
            Claims claims = extractAllClaims(token);
            
            // Expiration kontrolü
            Date expiration = claims.getExpiration();
            if (expiration != null && expiration.before(new Date())) {
                return false;
            }
            
            // Issuer kontrolü (Supabase)
            String issuer = claims.getIssuer();
            if (issuer == null || !issuer.contains("supabase")) {
                return false;
            }
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * JWT token'ından tüm claims'leri çıkarır
     */
    private Claims extractAllClaims(String token) {
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
        } catch (IllegalArgumentException e) {
            // Base64 değilse direkt kullan
            keyBytes = supabaseJwtSecret.getBytes(StandardCharsets.UTF_8);
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