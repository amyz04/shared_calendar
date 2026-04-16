package com.calendarapp.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

import lombok.Getter;


@Getter
public class CreateEventRequest {
    
    @NotBlank
    private String name;
    
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String scope;
}
