package com.DVMS.dvms_backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    VILLAGER,
    OFFICER,
    ADMIN;

    // Accepts "villager", "Villager", "VILLAGER" — any case
    @JsonCreator
    public static Role fromString(String value) {
        return Role.valueOf(value.toUpperCase());
    }
}