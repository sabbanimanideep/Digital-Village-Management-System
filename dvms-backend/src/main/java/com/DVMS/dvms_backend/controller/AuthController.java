package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.dto.*;
import com.DVMS.dvms_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

/**
 * REST controller for all authentication endpoints.
 *
 * Base URL: /api/auth
 *
 * Endpoints:
 *   POST /api/auth/register         — create a new account
 *   POST /api/auth/login            — sign in
 *   POST /api/auth/forgot-password  — request a password reset link
 *   POST /api/auth/reset-password   — set a new password using the reset token
 *
 * Uses constructor injection for AuthService.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")   // allow requests from the React frontend
public class AuthController {

    private final AuthService authService;

    // Constructor injection — no @Autowired needed
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── 1. Register ────────────────────────────────────────────────────────────
    /**
     * POST /api/auth/register
     *
     * Request body:
     * {
     *   "name":     "Ravi Kumar",
     *   "email":    "ravi@example.com",
     *   "password": "Secret123",
     *   "role":     "Villager"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        ApiResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // ── 2. Login ───────────────────────────────────────────────────────────────
    /**
     * POST /api/auth/login
     *
     * Request body:
     * {
     *   "email":    "ravi@example.com",
     *   "password": "Secret123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        ApiResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // ── 3. Forgot Password ─────────────────────────────────────────────────────
    /**
     * POST /api/auth/forgot-password
     *
     * Request body:
     * {
     *   "email": "ravi@example.com"
     * }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        ApiResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    // ── 4. Reset Password ──────────────────────────────────────────────────────
    /**
     * POST /api/auth/reset-password
     *
     * Request body:
     * {
     *   "token":       "uuid-token-from-email",
     *   "newPassword": "NewSecret456"
     * }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        ApiResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    // In your AuthController.java
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // If using JWT, logout is typically handled client-side
        // Just return success — client will clear the token
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logged out successfully"
        ));
    }
}
