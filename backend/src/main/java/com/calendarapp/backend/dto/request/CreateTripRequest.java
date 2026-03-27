package com.calendarapp.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Getter;

@Getter
public class CreateTripRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String groupId;

    private LocalDate startDate;
    private LocalDate endDate;

}
