package com.DVMS.dvms_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserSummaryDTO {

    private long totalVillagers;
    private List<UserWithComplaintDTO> users;
}
