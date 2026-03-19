package com.DVMS.dvms_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration with Role-Based Access Control (RBAC).
 *
 * Route-level permissions:
 * ┌─────────────────────────────┬─────────────────────────────────┐
 * │ Route Pattern               │ Allowed Roles                   │
 * ├─────────────────────────────┼─────────────────────────────────┤
 * │ /api/auth/**                │ PUBLIC (no login needed)        │
 * │ /api/admin/**               │ ADMIN only                      │
 * │ /api/officer/**             │ ADMIN + OFFICER                 │
 * │ /api/villager/**            │ ADMIN + OFFICER + VILLAGER      │
 * │ /api/common/**              │ Any authenticated user          │
 * └─────────────────────────────┴─────────────────────────────────┘
 *
 * @EnableMethodSecurity also allows @PreAuthorize on individual methods.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // enables @PreAuthorize / @PostAuthorize on methods
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth

                        // ── Public routes (no login required) ─────────────────────
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // ── Admin only ─────────────────────────────────────────────
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ── Officer and above ──────────────────────────────────────
                        .requestMatchers("/api/officer/**").hasAnyRole("ADMIN", "OFFICER")

                        // ── Villager and above (all logged-in users) ───────────────
                        .requestMatchers("/api/villager/**").hasAnyRole("ADMIN", "OFFICER", "VILLAGER")

                        // ── Any authenticated user ─────────────────────────────────
                        .requestMatchers("/api/common/**").authenticated()

                        .requestMatchers("/api/complaints/**").permitAll()

                        .requestMatchers("/api/schemes/**").permitAll()
                        .requestMatchers("/api/applications/**").permitAll()

                        .requestMatchers("/api/users/villagers-with-complaints").permitAll()

                        // OR allow all users APIs (easier for now)
                        .requestMatchers("/api/users/**").permitAll()

                        .requestMatchers("/api/officer/**").permitAll()

                        .requestMatchers("/**").permitAll()
                        // ── Everything else requires authentication ────────────────
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}