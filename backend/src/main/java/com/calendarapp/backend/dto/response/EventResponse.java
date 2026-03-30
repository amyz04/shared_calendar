package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class EventResponse {
    private String id;
    private String itineraryId;
    private String createdBy;
    private String name;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String scope;
    private String status;
    private LocalDateTime createdAt;
}