package com.calendarapp.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class CreateCalendarEventRequest {
    @NotBlank
    private String title;

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
}
