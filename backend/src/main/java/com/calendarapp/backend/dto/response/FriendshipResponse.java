package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FriendshipResponse {
    private String id;
    private UserResponse sender;
    private UserResponse invitee;
    private String status;
    private String createdAt;
}
