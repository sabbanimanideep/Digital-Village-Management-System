package com.DVMS.dvms_backend.dto;

import com.DVMS.dvms_backend.entity.Role;
import lombok.*;

/**
 * Safe user data returned to the client — never includes password or reset token.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long   id;
    private String name;
    private String email;
    private Role   role;   // returns "VILLAGER", "OFFICER", or "ADMIN"
}