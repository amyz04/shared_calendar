package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.response.CalendarResponse;
import com.calendarapp.backend.entity.Calendar;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.CalendarRepository;
import com.calendarapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;

    public List<CalendarResponse> getCalendars(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return calendarRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CalendarResponse createCalendar(String userId, String name, String source) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Calendar calendar = new Calendar();
        calendar.setUser(user);
        calendar.setName(name);
        calendar.setSource(Calendar.Source.valueOf(source.toUpperCase()));

        calendarRepository.save(calendar);
        return mapToResponse(calendar);
    }

    public void deleteCalendar(String userId, String calendarId) {
        Calendar calendar = calendarRepository.findById(calendarId)
                .orElseThrow(() -> new RuntimeException("Calendar not found"));

        if (!calendar.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        calendarRepository.delete(calendar);
    }

    private CalendarResponse mapToResponse(Calendar calendar) {
        return new CalendarResponse(
                calendar.getId(),
                calendar.getName(),
                calendar.getSource().name(),
                calendar.getCreatedAt()
        );
    }
}