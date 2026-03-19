package com.DVMS.dvms_backend.entity;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @ManyToOne
    @JoinColumn(name = "scheme_id")
    private Scheme scheme;

    private String status; // PENDING, APPROVED, REJECTED
}
