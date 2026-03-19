package com.DVMS.dvms_backend.dto;


import com.DVMS.dvms_backend.entity.Role;
import lombok.*;

/**
 * Request body for POST /api/auth/register
 *
 * Example:
 * {
 *   "name":     "Ravi Kumar",
 *   "email":    "ravi@example.com",
 *   "password": "Secret123",
 *   "role":     "VILLAGER"       ← must be VILLAGER, OFFICER, or ADMIN
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role   role;   // uses the Role enum directly
}
