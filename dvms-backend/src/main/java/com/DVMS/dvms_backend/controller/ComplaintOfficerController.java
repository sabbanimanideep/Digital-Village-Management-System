package com.DVMS.dvms_backend.controller;

import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.service.ComplaintOfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer/complaints") // ✅ new path
@CrossOrigin("*")
@RequiredArgsConstructor
public class ComplaintOfficerController {

    private final ComplaintOfficerService service;

    // ✅ Get all complaints
    @GetMapping
    public List<Complaint> getAll() {
        return service.getAllComplaints();
    }

    // ✅ Filter by status
    @GetMapping("/status/{status}")
    public List<Complaint> getByStatus(@PathVariable String status) {
        return service.getComplaintsByStatus(status);
    }

    // ✅ Update status
    @PutMapping("/{id}/status")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return service.updateStatus(id, status);
    }
}