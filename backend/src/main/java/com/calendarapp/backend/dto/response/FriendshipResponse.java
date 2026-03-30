package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FriendshipResponse {
    private String id;
    private UserResponse sender;
    private UserResponse invitee;
    private String status;
    private LocalDateTime createdAt;
}
