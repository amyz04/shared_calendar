package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class AvailabilityResponse {

    private Map<String, List<EventBlock>> events;

    @Getter
    @AllArgsConstructor
    public static class EventBlock {
        private String title;
        private String start;
        private String end;
    }
}