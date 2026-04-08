package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FriendshipResponse {
    private String id;
    private UserResponse sender;
    private UserResponse invitee; // null if invitee has no account yet
    private String inviteeEmail;
    private String status;
    private LocalDateTime createdAt;
}