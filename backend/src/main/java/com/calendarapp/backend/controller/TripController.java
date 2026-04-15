package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.CreateTripRequest;
import com.calendarapp.backend.dto.response.ItineraryResponse;
import com.calendarapp.backend.dto.response.TripResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateTripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(currentUser.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getTrips(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(tripService.getTrips(currentUser.getId()));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTrip(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String tripId) {
        return ResponseEntity.ok(tripService.getTrip(tripId, currentUser.getId()));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String tripId,
            @RequestBody CreateTripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(currentUser.getId(), tripId, request));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<String> deleteTrip(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String tripId) {
        tripService.deleteTrip(currentUser.getId(), tripId);
        return ResponseEntity.ok("Trip deleted successfully");
    }

    @PostMapping("/{tripId}/invite")
    public ResponseEntity<TripResponse> inviteMember(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String tripId,
            @RequestParam String friendId) {
        return ResponseEntity.ok(tripService.inviteMember(currentUser.getId(), tripId, friendId));
    }

    @PostMapping("/join")
    public ResponseEntity<TripResponse> joinTrip(
            @AuthenticationPrincipal User currentUser,
            @RequestParam String inviteToken) {
        return ResponseEntity.ok(tripService.joinTrip(currentUser.getId(), inviteToken));
    }

    @DeleteMapping("/{tripId}/leave")
    public ResponseEntity<String> leaveTrip(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String tripId) {
        tripService.leaveTrip(currentUser.getId(), tripId);
        return ResponseEntity.ok("Left trip successfully");
    }

    @PutMapping("/{tripId}/respond")
    public ResponseEntity<TripResponse> respondToTrip(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String tripId,
            @RequestParam String status) {
        return ResponseEntity.ok(tripService.respondToTrip(currentUser.getId(), tripId, status));
    }

    @GetMapping("/{tripId}/itineraries")
    public ResponseEntity<List<ItineraryResponse>> getItineraries(
        @PathVariable String tripId) {
    return ResponseEntity.ok(tripService.getItineraries(tripId));
}
}