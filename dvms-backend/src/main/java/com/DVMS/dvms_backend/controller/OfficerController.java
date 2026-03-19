package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.dto.ApiResponse;
import com.DVMS.dvms_backend.entity.User;
import com.DVMS.dvms_backend.entity.Role;
import com.DVMS.dvms_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Routes accessible by OFFICER and ADMIN.
 *
 * Base URL: /api/officer
 *
 * ┌──────────────────────────────────┬────────────────────────────────────────┐
 * │ Endpoint                         │ Description                            │
 * ├──────────────────────────────────┼────────────────────────────────────────┤
 * │ GET  /api/officer/villagers      │ View all villagers in the system       │
 * │ GET  /api/officer/villagers/{id} │ View a specific villager's details     │
 * └──────────────────────────────────┴────────────────────────────────────────┘
 */
@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")   // ADMIN and OFFICER can access
public class OfficerController {

    private final UserRepository userRepository;

    public OfficerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── View all villagers ─────────────────────────────────────────────────────
    @GetMapping("/villagers")
    public ResponseEntity<ApiResponse> getAllVillagers() {
        List<User> villagers = userRepository.findByRole(Role.VILLAGER);

        List<Object> result = villagers.stream()
                .map(u -> (Object) java.util.Map.of(
                        "id",    u.getId(),
                        "name",  u.getName(),
                        "email", u.getEmail(),
                        "role",  u.getRole()
                ))
                .toList();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("All villagers fetched successfully.")
                .data(result)
                .build());
    }

    // ── View a single villager ─────────────────────────────────────────────────
    @GetMapping("/villagers/{id}")
    public ResponseEntity<ApiResponse> getVillagerById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null || user.getRole() != Role.VILLAGER) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("Villager not found with id: " + id)
                    .data(null)
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Villager details fetched successfully.")
                .data(java.util.Map.of(
                        "id",    user.getId(),
                        "name",  user.getName(),
                        "email", user.getEmail(),
                        "role",  user.getRole()
                ))
                .build());
    }
}