package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.CreateEventRequest;
import com.calendarapp.backend.dto.response.EventResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itinerary/{itineraryId}/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String itineraryId,
            @Valid @RequestBody CreateEventRequest request) {
        return ResponseEntity.ok(eventService.createEvent(itineraryId, currentUser.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getEvents(
            @PathVariable String itineraryId) {
        return ResponseEntity.ok(eventService.getEvents(itineraryId));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable String itineraryId,
            @PathVariable String eventId,
            @RequestBody CreateEventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, request));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable String eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok("Event deleted successfully");
    }
}
