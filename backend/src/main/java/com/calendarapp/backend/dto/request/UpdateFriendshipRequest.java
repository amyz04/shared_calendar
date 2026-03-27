package com.calendarapp.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdateFriendshipRequest {
 
    @NotBlank
    private String status;
}
