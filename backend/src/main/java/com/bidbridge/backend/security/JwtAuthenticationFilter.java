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

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

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
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        
        try {
            // Supabase JWT token'ını doğrula
            if (supabaseJwtService.isTokenValid(jwt)) {
                final String userId = supabaseJwtService.extractUserId(jwt);
                final String email = supabaseJwtService.extractEmail(jwt);
                final String role = supabaseJwtService.extractRole(jwt);
                
                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Authentication object oluştur
                    // Principal olarak userId kullan (Supabase user ID)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userId, // Principal: Supabase user ID
                            email,  // Credentials: Email
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + (role != null ? role.toUpperCase() : "USER")))
                    );
                    
                    // Security context'e set et
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            logger.error("Supabase JWT token validation error", e);
            // Token geçersizse authentication'ı null bırak
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
} 