package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TripMemberResponse {
    private String id;
    private UserResponse User;
    private String status;
    private String joinedAt;    
}
