package com.DVMS.dvms_backend.service;

import com.DVMS.dvms_backend.dto.UserSummaryDTO;
import com.DVMS.dvms_backend.dto.UserWithComplaintDTO;
import com.DVMS.dvms_backend.entity.User;
import com.DVMS.dvms_backend.entity.Role; // ✅ IMPORTANT
import com.DVMS.dvms_backend.repository.UserRepository;
import com.DVMS.dvms_backend.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    public UserManagementService(UserRepository userRepository,
                                 ComplaintRepository complaintRepository) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
    }

    public UserSummaryDTO getVillagerUsersWithComplaints() {

        // ✅ FIX 1: use ENUM instead of String
        List<User> villagers = userRepository.findByRole(Role.VILLAGER);

        // ✅ 2. Complaint counts map
        List<Object[]> complaintData = complaintRepository.countComplaintsPerUser();

        Map<String, Long> complaintMap = new HashMap<>();
        for (Object[] obj : complaintData) {
            String email = (String) obj[0];
            Long count = (Long) obj[1];
            complaintMap.put(email, count);
        }

        // ✅ 3. Build response
        List<UserWithComplaintDTO> result = new ArrayList<>();

        for (User user : villagers) {
            long count = complaintMap.getOrDefault(user.getEmail(), 0L);

            result.add(new UserWithComplaintDTO(
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(), // ✅ FIX 2 (ENUM → String)
                    count
            ));
        }

        // ✅ FIX 3: use ENUM
        long totalVillagers = userRepository.countByRole(Role.VILLAGER);

        return new UserSummaryDTO(totalVillagers, result);
    }
}