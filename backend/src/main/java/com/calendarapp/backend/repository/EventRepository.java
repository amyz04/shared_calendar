package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Event;
import com.calendarapp.backend.entity.Itinerary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String>{
    List<Event> findByItinerary(Itinerary itinerary); // events belong to itinerary so we query using that
}
