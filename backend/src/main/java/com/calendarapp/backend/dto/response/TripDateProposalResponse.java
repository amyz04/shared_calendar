package com.calendarapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class TripDateProposalResponse {

    private String id;
    private String tripId;
    private UserResponse proposedBy;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private List<VoteResponse> votes;
    private int agreeCount;
    private int disagreeCount;
    private String createdAt;

    @Getter
    @AllArgsConstructor
    public static class VoteResponse {
        private String id;
        private UserResponse user;
        private String vote;
    }
}