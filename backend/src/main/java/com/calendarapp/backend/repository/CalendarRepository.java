package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Calendar;
import com.calendarapp.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, String> {

    List<Calendar> findByUser(User user);
}
