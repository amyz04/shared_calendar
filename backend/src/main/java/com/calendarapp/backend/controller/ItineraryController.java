package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.CreateEventRequest;
import com.calendarapp.backend.dto.response.EventResponse;
import com.calendarapp.backend.dto.response.ItineraryResponse;
import com.calendarapp.backend.dto.response.MessageResponse;
import com.calendarapp.backend.repository.UserRepository;
import com.calendarapp.backend.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;
    private final UserRepository userRepository;

    private String getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // get all itineraries for a trip
    @GetMapping("/api/trips/{tripId}/itineraries")
    public ResponseEntity<List<ItineraryResponse>> getItineraries(
            @PathVariable String tripId) {
        return ResponseEntity.ok(itineraryService.getItineraries(tripId));
    }

    // get single itinerary
    @GetMapping("/api/itinerary/{itineraryId}")
    public ResponseEntity<ItineraryResponse> getItinerary(
            @PathVariable String itineraryId) {
        return ResponseEntity.ok(itineraryService.getItinerary(itineraryId));
    }

    // update itinerary notes
    @PutMapping("/api/itinerary/{itineraryId}/notes")
    public ResponseEntity<ItineraryResponse> updateNotes(
            @PathVariable String itineraryId,
            @RequestBody String notes) {
        return ResponseEntity.ok(itineraryService.updateNotes(itineraryId, notes));
    }

    // add event to itinerary
    @PostMapping("/api/itinerary/{itineraryId}/events")
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable String itineraryId,
            @Valid @RequestBody CreateEventRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            itineraryService.createEvent(getUserId(principal), itineraryId, request)
        );
    }

    // update event
    @PutMapping("/api/itinerary/{itineraryId}/events/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable String itineraryId,
            @PathVariable String eventId,
            @Valid @RequestBody CreateEventRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            itineraryService.updateEvent(getUserId(principal), itineraryId, eventId, request)
        );
    }

    // delete event
    @DeleteMapping("/api/itinerary/{itineraryId}/events/{eventId}")
    public ResponseEntity<MessageResponse> deleteEvent(
            @PathVariable String itineraryId,
            @PathVariable String eventId,
            Principal principal) {
        itineraryService.deleteEvent(getUserId(principal), itineraryId, eventId);
        return ResponseEntity.ok(new MessageResponse("Event deleted"));
    }
}