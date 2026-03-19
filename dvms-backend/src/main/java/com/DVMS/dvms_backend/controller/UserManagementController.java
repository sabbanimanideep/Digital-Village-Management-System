package com.DVMS.dvms_backend.controller;



import com.DVMS.dvms_backend.dto.UserSummaryDTO;
import com.DVMS.dvms_backend.service.UserManagementService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    // ✅ Officer view users with complaint count
    @GetMapping("/villagers-with-complaints")
    public UserSummaryDTO getVillagersWithComplaints() {
        return userManagementService.getVillagerUsersWithComplaints();
    }
}
