package com.DVMS.dvms_backend.repository;



import com.DVMS.dvms_backend.entity.Application;
import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserEmail(String userEmail);

    interface ComplaintRepository extends JpaRepository<Complaint, Long> {

        // returns: [email, count]
        @Query("SELECT c.userEmail, COUNT(c) FROM Complaint c GROUP BY c.userEmail")
        List<Object[]> countComplaintsPerUser();
    }

    interface UserRepository extends JpaRepository<User, Long> {

        List<User> findByRole(String role);

        long countByRole(String role);
    }
}
