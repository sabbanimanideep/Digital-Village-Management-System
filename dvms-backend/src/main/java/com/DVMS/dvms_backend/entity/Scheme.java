package com.DVMS.dvms_backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schemes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String eligibility;
    private String benefits;
    private String lastDate;
}