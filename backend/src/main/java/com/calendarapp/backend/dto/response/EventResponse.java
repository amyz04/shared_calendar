package com.calendarapp.backend.dto.response;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EventResponse {
    private String id;
    private String itineraryId;
    private String name;
    private String description;
    private String location;
    private String address;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String scope;
    private String status;
    private String createdBy;
    private String createdAt;
}
