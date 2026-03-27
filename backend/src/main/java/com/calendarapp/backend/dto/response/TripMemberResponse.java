package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TripMemberResponse {
    private String id;
    private UserResponse User;
    private String status;
    private LocalDateTime joinedAt;    
}
