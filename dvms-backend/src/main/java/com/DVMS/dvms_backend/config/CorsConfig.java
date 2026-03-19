package com.DVMS.dvms_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Global CORS configuration for DVMS.
 *
 * Allows the React frontend (running on localhost:3000 or localhost:5173)
 * to communicate with this Spring Boot backend (running on localhost:5000).
 *
 * In production, replace the allowed origins with your actual frontend domain.
 * Example: "https://dvms.yourdomain.com"
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // ── Allowed Origins ────────────────────────────────────────────────────
        // Add every frontend URL that is allowed to call this API
        config.setAllowedOrigins(List.of(
                "http://localhost:5174",   // React (Create React App)
                "http://localhost:5173"    // React (Vite)
        ));

        // ── Allowed HTTP Methods ───────────────────────────────────────────────
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"    // required for browser preflight requests
        ));

        // ── Allowed Request Headers ────────────────────────────────────────────
        config.setAllowedHeaders(List.of(
                "Authorization",   // JWT Bearer token
                "Content-Type",    // application/json
                "Accept"
        ));

        // ── Exposed Response Headers ───────────────────────────────────────────
        // Headers the browser is allowed to read from the response
        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        // ── Allow Credentials ──────────────────────────────────────────────────
        // Must be true when sending Authorization headers or cookies
        config.setAllowCredentials(true);

        // ── Preflight Cache Duration ───────────────────────────────────────────
        // Browser caches the preflight response for 1 hour (3600 seconds)
        config.setMaxAge(3600L);

        // Apply this CORS config to ALL routes in the application
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
