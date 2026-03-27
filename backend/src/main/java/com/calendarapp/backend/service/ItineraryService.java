package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.response.ItineraryResponse;
import com.calendarapp.backend.entity.Itinerary;
import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.repository.ItineraryRepository;
import com.calendarapp.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;

    public ItineraryResponse getItinerary(String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Itinerary itinerary = itineraryRepository.findByTripID(trip)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        return mapToResponse(itinerary);
    }

    public ItineraryResponse updateNotes(String tripId, String notes) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Itinerary itinerary = itineraryRepository.findByTripID(trip)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        itinerary.setNotes(notes);
        itineraryRepository.save(itinerary);
        return mapToResponse(itinerary);
    }

    private ItineraryResponse mapToResponse(Itinerary itinerary) {
    return new ItineraryResponse(
            itinerary.getId(),
            itinerary.getTripID().getId(),
            itinerary.getNotes(),
            itinerary.getCreatedAt()
    );
    }       
    
}