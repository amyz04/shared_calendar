package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ItineraryResponse {
    private String id;
    private String tripId;
    private String notes;
    private LocalDateTime createdAt;
}
