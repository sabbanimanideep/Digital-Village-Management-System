package com.DVMS.dvms_backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * Standard JSON response wrapper for every API endpoint.
 *
 * Example success response:
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": { ... }
 * }
 *
 * Example error response:
 * {
 *   "success": false,
 *   "message": "Email already exists",
 *   "data": null
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {
    private boolean success;
    private String  message;
    private Object  data;        // can hold a UserResponse or any extra payload
}
