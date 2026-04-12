package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.CreateCalendarRequest;
import com.calendarapp.backend.dto.response.AvailabilityResponse;
import com.calendarapp.backend.dto.response.CalendarResponse;
import com.calendarapp.backend.dto.response.MessageResponse;
import com.calendarapp.backend.repository.UserRepository;
import com.calendarapp.backend.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;
    private final UserRepository userRepository;

    private String getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<CalendarResponse>> getCalendars(Principal principal) {
        return ResponseEntity.ok(calendarService.getCalendars(getUserId(principal)));
    }

    @PostMapping
    public ResponseEntity<CalendarResponse> createCalendar(
            @RequestBody CreateCalendarRequest request,
            Principal principal) {
        return ResponseEntity.ok(calendarService.createCalendar(
                getUserId(principal),
                request.getName(),
                request.getSource()
        ));
    }

    @PostMapping("/import")
    public ResponseEntity<CalendarResponse> importCalendar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("source") String source,
            Principal principal) {
        return ResponseEntity.ok(calendarService.importCalendar(
                getUserId(principal),
                name,
                source,
                file
        ));
    }

    @DeleteMapping("/{calendarId}")
    public ResponseEntity<MessageResponse> deleteCalendar(
            @PathVariable String calendarId,
            Principal principal) {
        calendarService.deleteCalendar(getUserId(principal), calendarId);
        return ResponseEntity.ok(new MessageResponse("Calendar deleted"));
    }

    @GetMapping("/availability")
    public ResponseEntity<AvailabilityResponse> getAvailability(Principal principal) {
        return ResponseEntity.ok(calendarService.getAvailability(getUserId(principal)));
}
}