package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.CreateTripRequest;
import com.calendarapp.backend.dto.response.TripResponse;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.TripRepository;
import com.calendarapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripResponse createTrip(String userId, CreateTripRequest request) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = new Trip();
        trip.setName(request.getName());
        trip.setOwner(owner);
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDetails(request.getDetails());
        trip.setStatus(Trip.Status.PROPOSED);

        tripRepository.save(trip);
        return mapToResponse(trip);
    }

    public List<TripResponse> getTrips(String userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return tripRepository.findByOwner(owner)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TripResponse getTrip(String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        return mapToResponse(trip);
    }

    public TripResponse updateTrip(String userId, String tripId, CreateTripRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        if (request.getName() != null) trip.setName(request.getName());
        if (request.getStartDate() != null) trip.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) trip.setEndDate(request.getEndDate());
        if (request.getDetails() != null) trip.setDetails(request.getDetails());

        tripRepository.save(trip);
        return mapToResponse(trip);
    }

    public void deleteTrip(String userId, String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        tripRepository.delete(trip);
    }

    private TripResponse mapToResponse(Trip trip) {
    UserResponse owner = new UserResponse(
            trip.getOwner().getId(),
            trip.getOwner().getFirstName(),
            trip.getOwner().getLastName(),
            trip.getOwner().getEmail(),
            trip.getOwner().getAvatarColor(),
            trip.getOwner().getDateOfBirth(),
            trip.getOwner().getCreatedAt()
    );

    return new TripResponse(
            trip.getId(),
            trip.getName(),
            trip.getInviteToken(),
            owner,
            null,              // members — empty for now, will populate later
            trip.getStartDate(),
            trip.getEndDate(),
            trip.getStatus().name(),
            trip.getCreatedAt()
    );
}
}