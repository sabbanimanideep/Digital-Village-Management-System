package com.DVMS.dvms_backend.repository;

import com.DVMS.dvms_backend.entity.User;
import com.DVMS.dvms_backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Database operations for the User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    // Fetch all users with a specific role (e.g. all VILLAGERs)
    List<User> findByRole(Role role);

    // ✅ ADD THIS (VERY IMPORTANT)
    long countByRole(Role role);

}