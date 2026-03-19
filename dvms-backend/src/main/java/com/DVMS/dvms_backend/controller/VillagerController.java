package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.dto.ApiResponse;
import com.DVMS.dvms_backend.entity.User;
import com.DVMS.dvms_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Routes accessible by VILLAGER, OFFICER, and ADMIN.
 *
 * Base URL: /api/villager
 *
 * ┌────────────────────────────────┬──────────────────────────────────────────┐
 * │ Endpoint                       │ Description                              │
 * ├────────────────────────────────┼──────────────────────────────────────────┤
 * │ GET /api/villager/profile      │ View own profile (logged-in user)        │
 * └────────────────────────────────┴──────────────────────────────────────────┘
 *
 * Authentication object gives us the currently logged-in user's email.
 */
@RestController
@RequestMapping("/api/villager")
@PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'VILLAGER')")
public class VillagerController {

    private final UserRepository userRepository;

    public VillagerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── View own profile ───────────────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getMyProfile(Authentication authentication) {

        // authentication.getName() returns the logged-in user's email
        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("User not found.")
                    .data(null)
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Profile fetched successfully.")
                .data(java.util.Map.of(
                        "id",    user.getId(),
                        "name",  user.getName(),
                        "email", user.getEmail(),
                        "role",  user.getRole()
                ))
                .build());
    }
}