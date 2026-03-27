package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItineraryResponse {
    private String id;
    private String tripId;
    private String notes;
    private String createdAt;
}
