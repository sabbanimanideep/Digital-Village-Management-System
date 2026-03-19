package com.DVMS.dvms_backend.controller;



import com.DVMS.dvms_backend.entity.Application;
import com.DVMS.dvms_backend.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin("*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    public Application apply(
            @RequestParam String email,
            @RequestParam Long schemeId) {

        return applicationService.applyForScheme(email, schemeId);
    }

    @GetMapping
    public List<Application> getUserApplications(@RequestParam String email) {
        return applicationService.getUserApplications(email);
    }
}
