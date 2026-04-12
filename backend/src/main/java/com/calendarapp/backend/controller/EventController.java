package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.CreateEventRequest;
import com.calendarapp.backend.dto.response.EventResponse;
import com.calendarapp.backend.dto.response.MessageResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.UserRepository;
import com.calendarapp.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/itinerary/{itineraryId}/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    private String getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @PostMapping("/itinerary/{itineraryId}/events")
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable String itineraryId,
            @Valid @RequestBody CreateEventRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            eventService.createEvent(getUserId(principal), itineraryId, request)
        );
    }

    @GetMapping("/itinerary/{itineraryId}/events")
    public ResponseEntity<List<EventResponse>> getEvents(
            @PathVariable String itineraryId) {
        return ResponseEntity.ok(eventService.getEvents(itineraryId));
    }

    @PutMapping("/itinerary/{itineraryId}/events/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable String itineraryId,
            @PathVariable String eventId,
            @Valid @RequestBody CreateEventRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            eventService.updateEvent(getUserId(principal), eventId, request)
        );
    }

    @DeleteMapping("/itinerary/{itineraryId}/events/{eventId}")
    public ResponseEntity<MessageResponse> deleteEvent(
            @PathVariable String itineraryId,
            @PathVariable String eventId,
            Principal principal) {
        eventService.deleteEvent(getUserId(principal), eventId);
        return ResponseEntity.ok(new MessageResponse("Event deleted"));
    }
}
