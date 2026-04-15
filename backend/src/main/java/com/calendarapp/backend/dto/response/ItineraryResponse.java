package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class ItineraryResponse {
    private String id;
    private String tripId;
    private String notes;
    private int dayNumber;
    private String date;
    private List<EventResponse> events;
    private String createdAt;
}
