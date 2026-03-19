package com.DVMS.dvms_backend.repository;

import com.DVMS.dvms_backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // existing method
    List<Complaint> findByUserEmail(String userEmail);

    // ✅ ADD THIS METHOD
    @Query("SELECT c.userEmail, COUNT(c) FROM Complaint c GROUP BY c.userEmail")
    List<Object[]> countComplaintsPerUser();

    // ✅ Add this (do NOT remove existing)
    List<Complaint> findByStatus(String status);

    // total complaints
    long count();

    // count by status
    long countByStatus(String status);

    // category grouping
    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countByCategory();

    // recent activities (latest complaints)
    List<Complaint> findTop5ByOrderByCreatedAtDesc();
}