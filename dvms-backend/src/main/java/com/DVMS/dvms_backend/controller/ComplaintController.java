package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintService service;

    // 🔹 Submit Complaint
    @PostMapping
    public Complaint submitComplaint(@RequestBody Complaint complaint) {
        return service.submitComplaint(complaint);
    }

    // 🔹 Get complaints by user
    @GetMapping
    public List<Complaint> getComplaints(@RequestParam String email) {
        return service.getUserComplaints(email);
    }
}
