package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String avatarColor;
    private LocalDate dateOfBirth;
    private LocalDateTime createdAt;
}