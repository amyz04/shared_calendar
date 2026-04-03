package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class TripResponse {
    private String id;
    private String name;
    private String destination;
    private String cover;
    private String inviteToken;
    private UserResponse owner;
    private List<TripMemberResponse> members;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime createdAt;
}