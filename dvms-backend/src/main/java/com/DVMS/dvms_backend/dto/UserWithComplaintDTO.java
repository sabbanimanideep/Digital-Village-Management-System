package com.DVMS.dvms_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserWithComplaintDTO {

    private String name;
    private String email;
    private String role;
    private long complaintCount;
}
