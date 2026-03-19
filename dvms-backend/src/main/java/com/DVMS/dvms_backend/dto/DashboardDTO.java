package com.DVMS.dvms_backend.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardDTO {

    private String officerName;
    private long totalVillagers;
    private long totalComplaints;
    private long pending;
    private long inProgress;
    private long resolved;

    private List<CategoryStatsDTO> categoryStats;
    private List<ActivityDTO> recentActivities;
}