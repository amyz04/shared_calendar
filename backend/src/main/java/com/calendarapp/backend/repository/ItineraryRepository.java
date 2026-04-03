package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Itinerary;
import com.calendarapp.backend.entity.Trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, String> {
    Optional<Itinerary> findByTrip(Trip trip);
}
