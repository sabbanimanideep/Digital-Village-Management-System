package com.DVMS.dvms_backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class CategoryStatsDTO {
    private String category;
    private double percentage;
}