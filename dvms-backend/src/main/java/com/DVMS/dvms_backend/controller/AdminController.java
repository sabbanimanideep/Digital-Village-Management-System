package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.dto.ApiResponse;
import com.DVMS.dvms_backend.dto.UserResponse;
import com.DVMS.dvms_backend.entity.User;
import com.DVMS.dvms_backend.entity.Role;
import com.DVMS.dvms_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Routes accessible by ADMIN only.
 *
 * Base URL: /api/admin
 *
 * ┌────────────────────────────────────┬──────────────────────────────────┐
 * │ Endpoint                           │ Description                      │
 * ├────────────────────────────────────┼──────────────────────────────────┤
 * │ GET  /api/admin/users              │ Get all users                    │
 * │ GET  /api/admin/users/role/{role}  │ Get users by role                │
 * │ DELETE /api/admin/users/{id}       │ Delete a user                    │
 * │ PUT  /api/admin/users/{id}/role    │ Change a user's role             │
 * └────────────────────────────────────┴──────────────────────────────────┘
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")   // entire controller is ADMIN only
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── Get all users ──────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("All users fetched successfully.")
                .data(users)
                .build());
    }

    // ── Get users by role ──────────────────────────────────────────────────────
    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse> getUsersByRole(@PathVariable Role role) {
        List<UserResponse> users = userRepository.findByRole(role)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Users with role " + role + " fetched successfully.")
                .data(users)
                .build());
    }

    // ── Delete a user ──────────────────────────────────────────────────────────
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("User not found with id: " + id)
                    .data(null)
                    .build());
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User deleted successfully.")
                .data(null)
                .build());
    }

    // ── Change a user's role ───────────────────────────────────────────────────
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> changeUserRole(
            @PathVariable Long id,
            @RequestParam Role newRole) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message("User not found with id: " + id)
                    .data(null)
                    .build());
        }

        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User role updated to " + newRole + " successfully.")
                .data(toResponse(user))
                .build());
    }

    // ── Helper ─────────────────────────────────────────────────────────────────
    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}