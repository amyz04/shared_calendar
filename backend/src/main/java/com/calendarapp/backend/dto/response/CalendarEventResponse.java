package com.calendarapp.backend.dto.response;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class CalendarEventResponse {
    private String id;
    private String calendarId;
    private String title;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private LocalDateTime createdAt;
}
