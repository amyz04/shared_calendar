package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TripMemberResponse {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String avatarColor;
    private String status;
    private LocalDateTime joinedAt;
}