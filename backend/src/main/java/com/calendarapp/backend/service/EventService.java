package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.CreateEventRequest;
import com.calendarapp.backend.dto.response.EventResponse;
import com.calendarapp.backend.entity.Event;
import com.calendarapp.backend.entity.Itinerary;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.EventRepository;
import com.calendarapp.backend.repository.ItineraryRepository;
import com.calendarapp.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ItineraryRepository itineraryRepository;
    private final UserRepository userRepository;

        @Transactional
    public EventResponse createEvent(String itineraryId, String userId, CreateEventRequest request) {

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = new Event();
        event.setItinerary(itinerary);
        event.setCreatedBy(user);
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setScope(Event.Scope.valueOf(request.getScope().toUpperCase()));
        event.setStatus(Event.Status.PROPOSED);

        eventRepository.save(event);
        return mapToResponse(event);
    }
        @Transactional
    public EventResponse updateEvent(String userId, String eventId, CreateEventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only the event creator can update this event");
        }

        if (request.getName() != null) event.setName(request.getName());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getStartTime() != null) event.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) event.setEndTime(request.getEndTime());
        if (request.getScope() != null) event.setScope(Event.Scope.valueOf(request.getScope().toUpperCase()));

        eventRepository.save(event);
        return mapToResponse(event);
    }
    @Transactional
    public void deleteEvent(String userId, String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only the event creator can delete this event");
        }
        eventRepository.delete(event);
    }

    private EventResponse mapToResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getItinerary().getId(),
                event.getCreatedBy().getId(),
                event.getName(),
                event.getDescription(),
                event.getLocation(),
                event.getStartTime(),
                event.getEndTime(),
                event.getScope().name(),
                event.getStatus().name(),
                event.getCreatedAt()
        );
    }
}