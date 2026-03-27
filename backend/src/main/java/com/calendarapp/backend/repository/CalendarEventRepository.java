package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Calendar;
import com.calendarapp.backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, String> {

    List<CalendarEvent> findByCalendar(Calendar calendar);

}
