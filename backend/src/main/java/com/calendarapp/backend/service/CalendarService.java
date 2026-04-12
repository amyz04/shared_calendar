package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.response.CalendarResponse;
import com.calendarapp.backend.entity.Calendar;
import com.calendarapp.backend.entity.CalendarEvent;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.CalendarEventRepository;
import com.calendarapp.backend.repository.CalendarRepository;
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

    @Transactional
    public CalendarResponse importCalendar(
        String userId,
        String name,
        String source,
        MultipartFile file
    ){
        

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // check if calendar with same name and source already exists for this user
        boolean alreadyExists = calendarRepository.findByUser(user)
                .stream()
                .anyMatch(c -> c.getName().equals(name) && 
                            c.getSource().name().equalsIgnoreCase(source));

        if (alreadyExists) {
            throw new RuntimeException("A calendar with this name already exists");
        }

        //create calendar record
        Calendar calendar = new Calendar();
        calendar.setUser(user);
        calendar.setName(name);
        calendar.setSource(Calendar.Source.valueOf(source.toUpperCase()));
        calendarRepository.save(calendar);

        //parse the .ics file
        try(InputStream is = file.getInputStream()){
            CalendarBuilder builder = new CalendarBuilder();
            net.fortuna.ical4j.model.Calendar ical = builder.build(is);

            for(Component component : ical.getComponents(Component.VEVENT)) {
                VEvent vevent = (VEvent) component;
                CalendarEvent event = new CalendarEvent();
                event.setCalendar(calendar);

                // get event title
                Summary summary = vevent.getSummary();
                event.setName(summary != null ? summary.getValue() : "Untitled");

                //get start time
                DtStart dtStart = vevent.getStartDate();
                if(dtStart != null){
                    event.setStartTime(dtStart.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
                }

                DtEnd dtEnd = vevent.getEndDate();
                if(dtEnd != null){
                    event.setEndTime(dtEnd.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
                }
                calendarEventRepository.save(event);
            }
        }
        catch (Exception e){
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

    public AvailabilityResponse getAvailability(String userId) {
        System.out.println("Getting availability for userId: " + userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Calendar> calendars = calendarRepository.findByUser(user);
        System.out.println("Found " + calendars.size() + " calendars for user");
    Map<String, List<AvailabilityResponse.EventBlock>> byDate = new HashMap<>();

    for (Calendar calendar : calendars) {
        List<CalendarEvent> events = calendarEventRepository.findByCalendar(calendar);
        System.out.println("Calendar " + calendar.getName() + " has " + events.size() + " events");

        for (CalendarEvent event : events) {
            if (event.getStartTime() == null) continue;

            // skip all-day events that have no time component
            LocalDateTime start = event.getStartTime();
            LocalDateTime end = event.getEndTime() != null
                    ? event.getEndTime()
                    : start.plusHours(1);

            // use just the date as the key e.g. "2026-04-15"
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

    
    private CalendarResponse mapToResponse(Calendar calendar) {
        return new CalendarResponse(
                calendar.getId(),
                calendar.getName(),
                calendar.getSource().name(),
                calendar.getCreatedAt()
        );
    }
}