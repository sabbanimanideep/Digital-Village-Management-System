package com.DVMS.dvms_backend.entity;

import com.DVMS.dvms_backend.entity.Role;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * User entity — stores all registered users.
 * Role is stored as a STRING in the database (e.g. "ADMIN", "OFFICER", "VILLAGER").
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Store enum as readable string in DB ("ADMIN", "OFFICER", "VILLAGER")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;
}