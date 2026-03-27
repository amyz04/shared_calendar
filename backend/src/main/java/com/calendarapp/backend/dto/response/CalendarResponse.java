package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CalendarResponse {
    private String id;
    private String name;
    private String source;
    private String createdAt;
}
