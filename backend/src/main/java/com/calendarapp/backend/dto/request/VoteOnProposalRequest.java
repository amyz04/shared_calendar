package com.calendarapp.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class VoteOnProposalRequest {

    @NotBlank
    private String vote; // "AGREE" or "DISAGREE"
}