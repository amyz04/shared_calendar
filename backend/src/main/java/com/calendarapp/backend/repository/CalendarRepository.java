package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, String> {

    Optional<Calendar> findbyCalendarName(String name);

    boolean existsByCalendarName(String name);
}
