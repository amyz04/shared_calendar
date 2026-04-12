package com.calendarapp.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CreateCalendarRequest {
    @NotBlank
    private String name;
}
