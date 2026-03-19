package com.DVMS.dvms_backend.service;

import com.DVMS.dvms_backend.dto.*;
import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.entity.Role;
import com.DVMS.dvms_backend.repository.ComplaintRepository;
import com.DVMS.dvms_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ComplaintRepository complaintRepo;
    private final UserRepository userRepo;

    public DashboardDTO getDashboard(String officerName) {

        long totalVillagers = userRepo.countByRole(Role.VILLAGER);
        long totalComplaints = complaintRepo.count();

        long pending = complaintRepo.countByStatus("Pending");
        long inProgress = complaintRepo.countByStatus("In Progress");
        long resolved = complaintRepo.countByStatus("Resolved");

        // ✅ Category %
        List<Object[]> categoryData = complaintRepo.countByCategory();
        List<CategoryStatsDTO> categoryStats = new ArrayList<>();

        for (Object[] obj : categoryData) {
            String category = (String) obj[0];
            Long count = (Long) obj[1];

            double percent = (count * 100.0) / totalComplaints;

            categoryStats.add(new CategoryStatsDTO(category, percent));
        }

        // ✅ Recent activities
        List<Complaint> recent = complaintRepo.findTop5ByOrderByCreatedAtDesc();
        List<ActivityDTO> activities = new ArrayList<>();

        for (Complaint c : recent) {
            activities.add(new ActivityDTO(
                    "Updated complaint " + c.getComplaintId() + " to " + c.getStatus(),
                    c.getCreatedAt()
            ));
        }

        return new DashboardDTO(
                officerName,
                totalVillagers,
                totalComplaints,
                pending,
                inProgress,
                resolved,
                categoryStats,
                activities
        );
    }
}