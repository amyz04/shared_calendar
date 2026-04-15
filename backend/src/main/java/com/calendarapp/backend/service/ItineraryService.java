package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.CreateEventRequest;
import com.calendarapp.backend.dto.response.EventResponse;
import com.calendarapp.backend.dto.response.ItineraryResponse;
import com.calendarapp.backend.entity.Event;
import com.calendarapp.backend.entity.Itinerary;
import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.EventRepository;
import com.calendarapp.backend.repository.ItineraryRepository;
import com.calendarapp.backend.repository.TripRepository;
import com.calendarapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    // get all itineraries for a trip
    public List<ItineraryResponse> getItineraries(String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return itineraryRepository.findByTripOrderByDayNumberAsc(trip)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // get single itinerary
    public ItineraryResponse getItinerary(String itineraryId) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));
        return mapToResponse(itinerary);
    }

    // update notes on an itinerary
    @Transactional
    public ItineraryResponse updateNotes(String itineraryId, String notes) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        itinerary.setNotes(notes);
        itineraryRepository.save(itinerary);
        return mapToResponse(itinerary);
    }

    // add an event to an itinerary
    @Transactional
    public EventResponse createEvent(
            String userId, String itineraryId, CreateEventRequest request) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = new Event();
        event.setItinerary(itinerary);
        event.setCreatedBy(creator);
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setScope(request.getScope() != null
                ? Event.Scope.valueOf(request.getScope().toUpperCase())
                : Event.Scope.GROUP);
        event.setStatus(Event.Status.PROPOSED);

        eventRepository.save(event);
        return mapEventToResponse(event, itineraryId);
    }

    // update an event
    @Transactional
    public EventResponse updateEvent(
            String userId, String itineraryId, String eventId, CreateEventRequest request) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getItinerary().getId().equals(itineraryId)) {
            throw new RuntimeException("Event does not belong to this itinerary");
        }

        if (request.getName() != null) event.setName(request.getName());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getStartTime() != null) event.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) event.setEndTime(request.getEndTime());
        if (request.getScope() != null) {
            event.setScope(Event.Scope.valueOf(request.getScope().toUpperCase()));
        }

        eventRepository.save(event);
        return mapEventToResponse(event, itineraryId);
    }

    // delete an event
    @Transactional
    public void deleteEvent(String userId, String itineraryId, String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getItinerary().getId().equals(itineraryId)) {
            throw new RuntimeException("Event does not belong to this itinerary");
        }

        eventRepository.delete(event);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private EventResponse mapEventToResponse(Event event, String itineraryId) {
        return new EventResponse(
                event.getId(), itineraryId, event.getCreatedBy().getId(), event.getName(), event.getDescription(), event.getLocation(), event.getStartTime(), event.getEndTime(), event.getScope().name(), event.getStatus().name(), event.getCreatedAt()
        );
    }

    public ItineraryResponse mapToResponse(Itinerary itinerary) {
        List<EventResponse> events = itinerary.getEvents().stream()
                .map(e -> mapEventToResponse(e, itinerary.getId()))
                .collect(Collectors.toList());

        return new ItineraryResponse(
                itinerary.getId(),
                itinerary.getTrip().getId(),
                itinerary.getNotes(),
                itinerary.getDayNumber(),
                itinerary.getDate() != null ? itinerary.getDate().toString() : null,
                events,
                itinerary.getCreatedAt() != null ? itinerary.getCreatedAt().toString() : null
        );
    }
}