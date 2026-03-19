package com.DVMS.dvms_backend.service;

import com.DVMS.dvms_backend.entity.Complaint;
import com.DVMS.dvms_backend.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository repository;

    public Complaint submitComplaint(Complaint complaint) {
        complaint.setComplaintId("CMP-" + UUID.randomUUID().toString().substring(0, 6));
        complaint.setStatus("Pending");
        complaint.setCreatedAt(LocalDateTime.now());
        return repository.save(complaint);
    }

    public List<Complaint> getUserComplaints(String email) {
        return repository.findByUserEmail(email);
    }
}
