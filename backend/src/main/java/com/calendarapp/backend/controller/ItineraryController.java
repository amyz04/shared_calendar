package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.response.ItineraryResponse;
import com.calendarapp.backend.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @GetMapping
    public ResponseEntity<ItineraryResponse> getItinerary(
            @PathVariable String tripId) {
        return ResponseEntity.ok(itineraryService.getItinerary(tripId));
    }

    @PutMapping
    public ResponseEntity<ItineraryResponse> updateNotes(
            @PathVariable String tripId,
            @RequestParam String notes) {
        return ResponseEntity.ok(itineraryService.updateNotes(tripId, notes));
    }
}