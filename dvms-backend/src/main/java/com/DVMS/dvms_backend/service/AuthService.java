package com.DVMS.dvms_backend.service;

import com.DVMS.dvms_backend.dto.*;
import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.entity.User;
import com.DVMS.dvms_backend.entity.Role;
import com.DVMS.dvms_backend.exception.BadRequestException;
import com.DVMS.dvms_backend.exception.ResourceNotFoundException;
import com.DVMS.dvms_backend.repository.ComplaintRepository;
import com.DVMS.dvms_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Handles all authentication business logic.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ── 1. Register ────────────────────────────────────────────────────────────
    public ApiResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        // Default to VILLAGER if no role is provided
        Role role = request.getRole() != null ? request.getRole() : Role.VILLAGER;

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(newUser);

        return ApiResponse.builder()
                .success(true)
                .message("User registered successfully as " + role + "!")
                .data(toUserResponse(savedUser))
                .build();
    }

    // ── 2. Login ───────────────────────────────────────────────────────────────
    public ApiResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid password. Please try again.");
        }

        return ApiResponse.builder()
                .success(true)
                .message("Login successful! Welcome, " + user.getName() + " (" + user.getRole() + ")")
                .data(toUserResponse(user))
                .build();
    }

    // ── 3. Forgot Password ─────────────────────────────────────────────────────
    public ApiResponse forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with email: " + request.getEmail()));

        String token  = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        user.setResetToken(token);
        user.setTokenExpiry(expiry);
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        System.out.println("====================================================");
        System.out.println("  PASSWORD RESET LINK (development only)");
        System.out.println("  User  : " + user.getEmail());
        System.out.println("  Role  : " + user.getRole());
        System.out.println("  Link  : " + resetLink);
        System.out.println("  Expiry: " + expiry);
        System.out.println("====================================================");

        return ApiResponse.builder()
                .success(true)
                .message("Password reset link has been sent to your email.")
                .data(null)
                .build();
    }

    // ── 4. Reset Password ──────────────────────────────────────────────────────
    public ApiResponse resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException(
                        "Invalid reset token. Please request a new one."));

        if (user.getTokenExpiry() == null || LocalDateTime.now().isAfter(user.getTokenExpiry())) {
            throw new BadRequestException("Reset token has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);

        return ApiResponse.builder()
                .success(true)
                .message("Password reset successfully. You can now log in.")
                .data(null)
                .build();
    }

    // ── Helper ─────────────────────────────────────────────────────────────────
    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Service
    @RequiredArgsConstructor
    public static class ComplaintOfficerService {

        private final ComplaintRepository repository;

        // ✅ Get all complaints (Officer view)
        public List<Complaint> getAllComplaints() {
            return repository.findAll();
        }

        // ✅ Filter by status
        public List<Complaint> getComplaintsByStatus(String status) {
            return repository.findByStatus(status);
        }

        // ✅ Update complaint status (Officer action)
        public Complaint updateStatus(Long id, String status) {
            Complaint complaint = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Complaint not found"));

            complaint.setStatus(status);
            return repository.save(complaint);
        }
    }
}