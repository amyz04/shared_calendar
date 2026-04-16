package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.response.CalendarResponse;
import com.calendarapp.backend.entity.Calendar;
import com.calendarapp.backend.entity.CalendarEvent;
import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.TripMember;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.CalendarEventRepository;
import com.calendarapp.backend.repository.CalendarRepository;
import com.calendarapp.backend.repository.TripRepository;
import com.calendarapp.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.Summary;
import org.springframework.web.multipart.MultipartFile;
import com.calendarapp.backend.dto.response.AvailabilityResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final TripRepository tripRepository;

    /**
     * Converts an ical4j Date or DateTime to LocalDateTime.
     * Pure DATE values (all-day events) have no time — treat them as
     * 00:00 (start) or 23:59 (end) so they block the full day.
     */
    private LocalDateTime parseDateTime(java.util.Date date, boolean isEnd) {
        if (date == null) return null;
        if (date instanceof net.fortuna.ical4j.model.Date
                && !(date instanceof net.fortuna.ical4j.model.DateTime)) {
            // All-day event: use UTC date, no zone shift
            java.time.LocalDate ld = date.toInstant()
                    .atZone(ZoneId.of("UTC"))
                    .toLocalDate();
            return isEnd ? ld.atTime(23, 59) : ld.atStartOfDay();
        }
        // Timed event: convert with system zone
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    @Transactional
    public CalendarResponse importCalendar(String userId, String name, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyExists = calendarRepository.findByUser(user)
                .stream()
                .anyMatch(c -> c.getName().equals(name));

        if (alreadyExists) {
            throw new RuntimeException("A calendar with this name already exists");
        }

        Calendar calendar = new Calendar();
        calendar.setUser(user);
        calendar.setName(name);
        calendarRepository.save(calendar);

        try (InputStream is = file.getInputStream()) {
            CalendarBuilder builder = new CalendarBuilder();
            net.fortuna.ical4j.model.Calendar ical = builder.build(is);

            for (Component component : ical.getComponents(Component.VEVENT)) {
                VEvent vevent = (VEvent) component;
                CalendarEvent event = new CalendarEvent();
                event.setCalendar(calendar);

                Summary summary = vevent.getSummary();
                event.setName(summary != null ? summary.getValue() : "Untitled");

                DtStart dtStart = vevent.getStartDate();
                if (dtStart != null) {
                    event.setStartTime(parseDateTime(dtStart.getDate(), false));
                }

                DtEnd dtEnd = vevent.getEndDate();
                if (dtEnd != null) {
                    event.setEndTime(parseDateTime(dtEnd.getDate(), true));
                } else if (event.getStartTime() != null) {
                    event.setEndTime(event.getStartTime().plusHours(1));
                }

                calendarEventRepository.save(event);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse calendar file: " + e.getMessage());
        }

        return mapToResponse(calendar);
    }

    public List<CalendarResponse> getCalendars(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return calendarRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CalendarResponse createCalendar(String userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Calendar calendar = new Calendar();
        calendar.setUser(user);
        calendar.setName(name);

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

    public Map<String, AvailabilityResponse> getTripAvailability(String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Map<String, AvailabilityResponse> result = new HashMap<>();

        trip.getMembers().stream()
                .filter(m -> m != null && m.getUser() != null
                        && m.getStatus() == TripMember.Status.CONFIRMED)
                .forEach(m -> {
                    User user = m.getUser();
                    if (calendarRepository.existsByUser(user)) {
                        AvailabilityResponse avail = getAvailabilityForUser(user);
                        result.put(user.getEmail(), avail);
                    }
                });

        return result;
    }

    public AvailabilityResponse getAvailabilityForUser(User user) {
        List<Calendar> calendars = calendarRepository.findByUser(user);
        Map<String, List<AvailabilityResponse.EventBlock>> byDate = new HashMap<>();

        for (Calendar calendar : calendars) {
            List<CalendarEvent> events = calendarEventRepository.findByCalendar(calendar);

            for (CalendarEvent event : events) {
                if (event.getStartTime() == null) continue;

                LocalDateTime start = event.getStartTime();
                LocalDateTime end = event.getEndTime() != null
                        ? event.getEndTime()
                        : start.plusHours(1);

                String dateKey = start.toLocalDate().toString();

                AvailabilityResponse.EventBlock block = new AvailabilityResponse.EventBlock(
                        event.getName(),
                        start.toString(),
                        end.toString()
                );

                byDate.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(block);
            }
        }

        return new AvailabilityResponse(byDate);
    }

    public AvailabilityResponse getAvailability(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getAvailabilityForUser(user);
    }

    private CalendarResponse mapToResponse(Calendar calendar) {
        return new CalendarResponse(
                calendar.getId(),
                calendar.getName(),
                calendar.getCreatedAt()
        );
    }
}