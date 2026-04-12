package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.CreateTripRequest;
import com.calendarapp.backend.dto.response.TripMemberResponse;
import com.calendarapp.backend.dto.response.TripResponse;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.Itinerary;
import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.TripMember;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.TripRepository;
import com.calendarapp.backend.repository.TripMemberRepository;
import com.calendarapp.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMemberRepository tripMemberRepository;

    public TripResponse createTrip(String userId, CreateTripRequest request) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = new Trip();
        trip.setName(request.getName());
        trip.setDestination(request.getDestination());
        trip.setCover(request.getCover());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDetails(request.getDetails());
        trip.setOwner(owner);
        trip.setInviteToken(generateInviteToken());
        trip.setStatus(Trip.Status.PROPOSED);

        Trip savedTrip = tripRepository.save(trip);

        // auto create itinerary and attach to trip
        Itinerary itinerary = new Itinerary();
        itinerary.setTrip(savedTrip);
        trip.setItinerary(itinerary);

        // add owner as a confirmed member automatically
        TripMember ownerMember = new TripMember();
        ownerMember.setTrip(savedTrip);
        ownerMember.setUser(owner);
        ownerMember.setStatus(TripMember.Status.CONFIRMED);
        trip.getMembers().add(ownerMember);

        tripRepository.save(savedTrip);
        return mapToResponse(savedTrip, userId);
    }

    @Transactional
    public List<TripResponse> getTrips(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Trip> ownedTrips = tripRepository.findByOwner(user);

        List<Trip> memberTrips = tripMemberRepository.findByUser(user)
                .stream()
                .map(TripMember::getTrip)
                .filter(t -> !t.getOwner().getId().equals(userId))
                .collect(Collectors.toList());

        ownedTrips.addAll(memberTrips);

        return ownedTrips.stream()
                .map(t -> mapToResponse(t, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public TripResponse getTrip(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        return mapToResponse(trip, userId);
    }

    @Transactional
    public TripResponse updateTrip(String userId, String tripId, CreateTripRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        if (request.getName() != null) trip.setName(request.getName());
        if (request.getDestination() != null) trip.setDestination(request.getDestination());
        if (request.getCover() != null) trip.setCover(request.getCover());
        if (request.getStartDate() != null) trip.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) trip.setEndDate(request.getEndDate());
        if (request.getDetails() != null) trip.setDetails(request.getDetails());

        tripRepository.save(trip);
        return mapToResponse(trip, userId);
    }

    @Transactional
    public void deleteTrip(String userId, String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        tripRepository.delete(trip);
    }

    @Transactional
    public TripResponse inviteMember(String userId, String tripId, String friendId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Only the trip owner can invite members");
        }

        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (tripMemberRepository.existsByTripAndUser(trip, friend)) {
            throw new RuntimeException("User is already a member of this trip");
        }

        TripMember member = new TripMember();
        member.setTrip(trip);
        member.setUser(friend);
        member.setStatus(TripMember.Status.PENDING);
        tripMemberRepository.save(member);

        // reload trip to get updated members list
        Trip reloadedTrip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return mapToResponse(reloadedTrip, userId);
    }

    @Transactional
    public TripResponse joinTrip(String userId, String inviteToken) {
        Trip trip = tripRepository.findByInviteToken(inviteToken)
                .orElseThrow(() -> new RuntimeException("Invalid invite token"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (tripMemberRepository.existsByTripAndUser(trip, user)) {
            throw new RuntimeException("Already a member of this trip");
        }

        TripMember member = new TripMember();
        member.setTrip(trip);
        member.setUser(user);
        member.setStatus(TripMember.Status.CONFIRMED);
        tripMemberRepository.save(member);

        return mapToResponse(trip, userId);
    }

    @Transactional
    public void leaveTrip(String userId, String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Trip owner cannot leave — delete the trip instead");
        }

        TripMember member = tripMemberRepository.findByTripAndUser(trip, user)
                .orElseThrow(() -> new RuntimeException("Not a member of this trip"));

        tripMemberRepository.delete(member);
    }

    @Transactional
public TripResponse respondToTrip(String userId, String tripId, String status) {
    Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    TripMember member = tripMemberRepository.findByTripAndUser(trip, user)
            .orElseThrow(() -> new RuntimeException("Not a member of this trip"));

    member.setStatus(TripMember.Status.valueOf(status.toUpperCase()));
    tripMemberRepository.save(member);

    // check if all non-owner members have responded
    List<TripMember> nonOwnerMembers = trip.getMembers().stream()
            .filter(m -> !m.getUser().getId().equals(trip.getOwner().getId()))
            .toList();

    boolean allResponded = nonOwnerMembers.stream()
            .allMatch(m -> m.getStatus() == TripMember.Status.CONFIRMED
                    || m.getStatus() == TripMember.Status.REJECTED);

    if (allResponded && !nonOwnerMembers.isEmpty()) {
        trip.setStatus(Trip.Status.CONFIRMED);
        tripRepository.save(trip);
    }

    Trip reloadedTrip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

    return mapToResponse(reloadedTrip, userId);
}

    private String generateInviteToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private TripResponse mapToResponse(Trip trip, String currentUserId) {
    UserResponse owner = new UserResponse(
            trip.getOwner().getId(),
            trip.getOwner().getFirstName(),
            trip.getOwner().getLastName(),
            trip.getOwner().getEmail(),
            trip.getOwner().getAvatarColor(),
            trip.getOwner().getDateOfBirth(),
            trip.getOwner().getCreatedAt()
    );

    List<TripMemberResponse> members = trip.getMembers().stream()
            .filter(m -> m != null && m.getUser() != null)
            .map(m -> new TripMemberResponse(
                    m.getId(),
                    m.getUser().getId(),
                    m.getUser().getFirstName(),
                    m.getUser().getLastName(),
                    m.getUser().getEmail(),
                    m.getUser().getAvatarColor(),
                    m.getStatus().name(),
                    m.getJoinedAt()
            ))
            .collect(Collectors.toList());

    boolean isOwner = trip.getOwner().getId().equals(currentUserId);

    long acceptedCount = trip.getMembers().stream()
            .filter(m -> m != null && m.getUser() != null
                    && m.getStatus() == TripMember.Status.CONFIRMED
                    && !m.getUser().getId().equals(trip.getOwner().getId()))
            .count();

    long declinedCount = trip.getMembers().stream()
            .filter(m -> m != null && m.getUser() != null
                    && m.getStatus() == TripMember.Status.REJECTED)
            .count();

    String currentUserStatus = trip.getMembers().stream()
            .filter(m -> m != null && m.getUser() != null
                    && m.getUser().getId().equals(currentUserId))
            .map(m -> m.getStatus().name())
            .findFirst()
            .orElse("PENDING");

    return new TripResponse(
            trip.getId(),
            trip.getName(),
            trip.getDestination(),
            trip.getCover(),
            trip.getInviteToken(),
            owner,
            members,
            trip.getStartDate(),
            trip.getEndDate(),
            trip.getStatus().name(),
            trip.getCreatedAt(),
            isOwner,
            acceptedCount,
            declinedCount,
            currentUserStatus
        );
        }
}