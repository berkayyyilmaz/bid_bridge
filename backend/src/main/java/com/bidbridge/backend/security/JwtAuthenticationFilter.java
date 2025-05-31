package com.bidbridge.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final SupabaseJwtService supabaseJwtService;

    public JwtAuthenticationFilter(SupabaseJwtService supabaseJwtService) {
        this.supabaseJwtService = supabaseJwtService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        // Auth endpoint'leri ve public endpoint'leri filtreden geçirme
        return path.equals("/auth/login") || 
               path.equals("/auth/register") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs") ||
               path.equals("/api-docs");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        
        logger.debug("Processing request to: {}", request.getServletPath());
        logger.debug("Authorization header present: {}", authHeader != null);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Authorization header found");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        logger.debug("JWT token extracted, length: {}", jwt.length());
        
        try {
            // Supabase JWT token'ını doğrula
            if (supabaseJwtService.isTokenValid(jwt)) {
                final String userId = supabaseJwtService.extractUserId(jwt);
                final String email = supabaseJwtService.extractEmail(jwt);
                final String role = supabaseJwtService.extractRole(jwt);
                
                logger.debug("Token validation successful - UserId: {}, Email: {}, Role: {}", userId, email, role);
                
                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Supabase role'ünü Spring Security role'üne dönüştür
                    String springRole = "USER"; // Default role
                    if ("authenticated".equals(role)) {
                        springRole = "USER";
                    } else if ("admin".equals(role)) {
                        springRole = "ADMIN";
                    }
                    
                    // Authentication object oluştur
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userId, // Principal: Supabase user ID
                            email,  // Credentials: Email
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + springRole))
                    );
                    
                    // Security context'e set et
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication set successfully for user: {}", userId);
                }
            } else {
                logger.warn("Token validation failed");
            }
        } catch (Exception e) {
            logger.error("Supabase JWT token validation error: {}", e.getMessage(), e);
            // Token geçersizse authentication'ı null bırak
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
} 