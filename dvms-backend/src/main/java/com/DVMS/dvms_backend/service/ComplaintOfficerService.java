package com.DVMS.dvms_backend.service;

import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintOfficerService {

    private final ComplaintRepository repository;

    // ✅ Get all complaints
    public List<Complaint> getAllComplaints() {
        return repository.findAll();
    }

    // ✅ Filter by status
    public List<Complaint> getComplaintsByStatus(String status) {
        return repository.findByStatus(formatStatus(status));
    }

    // ✅ Update status (Officer action)
    public Complaint updateStatus(Long id, String status) {
        Complaint complaint = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(formatStatus(status)); // ✅ safe
        return repository.save(complaint);
    }

    // ✅ Helper (important for consistency)
    private String formatStatus(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        switch (status.trim().toLowerCase()) {
            case "pending":
                return "Pending";
            case "in progress":
            case "in_progress":
                return "In Progress";
            case "resolved":
                return "Resolved";
            default:
                throw new IllegalArgumentException("Invalid status value");
        }
    }
}