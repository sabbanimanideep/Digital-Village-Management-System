package com.DVMS.dvms_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActivityDTO {
    private String action;
    private LocalDateTime time;
}