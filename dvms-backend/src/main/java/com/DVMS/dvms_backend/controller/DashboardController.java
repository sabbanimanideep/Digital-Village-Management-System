package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.dto.DashboardDTO;
import com.DVMS.dvms_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer/dashboard")
@CrossOrigin("*")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardDTO getDashboard(@RequestParam String name) {
        return service.getDashboard(name);
    }
}