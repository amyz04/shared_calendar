package com.calendarapp.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Getter;

@Getter
public class CreateTripRequest {
    @NotBlank
    private String name;
    
    private LocalDate startDate;
    private LocalDate endDate;

}
