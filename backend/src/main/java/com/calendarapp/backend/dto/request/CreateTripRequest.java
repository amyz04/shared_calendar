package com.calendarapp.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTripRequest {

    @NotBlank
    private String name;

    private String destination;
    private String cover;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
}