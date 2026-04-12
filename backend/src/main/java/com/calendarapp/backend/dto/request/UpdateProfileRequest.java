package com.calendarapp.backend.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import java.time.LocalDate;

@Getter
public class UpdateProfileRequest {

    private String firstName;
    private String lastName;

    @Email
    private String email;

    private String avatarColor;
    private LocalDate dateOfBirth;
}