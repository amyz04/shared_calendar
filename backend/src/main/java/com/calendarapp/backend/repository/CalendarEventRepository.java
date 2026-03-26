package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, String> {

    Optional<CalendarEvent> findByCalendarEventName(String name);

    boolean existsByCalendarEventName(String name);

}
