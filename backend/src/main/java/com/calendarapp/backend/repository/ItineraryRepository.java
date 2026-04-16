package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Itinerary;
import com.calendarapp.backend.entity.Trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, String> {
    List<Itinerary> findByTrip(Trip trip);
    List<Itinerary> findByTripOrderByDayNumberAsc(Trip trip);
    Optional<Itinerary> findByTripAndDayNumber(Trip trip, int dayNumber);
    Optional<Itinerary> findByTripAndDate(Trip trip, LocalDate date);
    void deleteByTrip(Trip trip);
}