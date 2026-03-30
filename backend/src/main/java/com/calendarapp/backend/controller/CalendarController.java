package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.response.CalendarResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping
    public ResponseEntity<List<CalendarResponse>> getCalendars(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(calendarService.getCalendars(currentUser.getId()));
    }

    @PostMapping("/connect/{provider}")
    public ResponseEntity<CalendarResponse> connectCalendar(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String provider,
            @RequestParam String name) {
        return ResponseEntity.ok(calendarService.createCalendar(currentUser.getId(), name, provider));
    }

    @DeleteMapping("/{calendarId}")
    public ResponseEntity<String> deleteCalendar(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String calendarId) {
        calendarService.deleteCalendar(currentUser.getId(), calendarId);
        return ResponseEntity.ok("Calendar deleted successfully");
    }
}