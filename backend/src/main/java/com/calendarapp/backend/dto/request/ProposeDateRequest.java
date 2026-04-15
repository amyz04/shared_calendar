package com.calendarapp.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import java.time.LocalDate;

@Getter
public class ProposeDateRequest {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}