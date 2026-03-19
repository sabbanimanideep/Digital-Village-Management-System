package com.DVMS.dvms_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String complaintId;

    private String userEmail;
    private String category;
    private String priority;
    private String subject;

    @Column(length = 2000)
    private String description;

    private String location;

    private String status;

    private LocalDateTime createdAt;
}
