package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.ProposeDateRequest;
import com.calendarapp.backend.dto.request.VoteOnProposalRequest;
import com.calendarapp.backend.dto.response.TripDateProposalResponse;
import com.calendarapp.backend.repository.UserRepository;
import com.calendarapp.backend.service.TripDateProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripDateProposalController {

    private final TripDateProposalService proposalService;
    private final UserRepository userRepository;

    private String getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping("/{tripId}/proposals")
    public ResponseEntity<List<TripDateProposalResponse>> getProposals(
            @PathVariable String tripId) {
        return ResponseEntity.ok(proposalService.getProposals(tripId));
    }

    @PostMapping("/{tripId}/proposals")
    public ResponseEntity<TripDateProposalResponse> proposeDate(
            @PathVariable String tripId,
            @Valid @RequestBody ProposeDateRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            proposalService.proposeDate(getUserId(principal), tripId, request)
        );
    }

    @PostMapping("/proposals/{proposalId}/vote")
    public ResponseEntity<TripDateProposalResponse> vote(
            @PathVariable String proposalId,
            @Valid @RequestBody VoteOnProposalRequest request,
            Principal principal) {
        return ResponseEntity.ok(
            proposalService.voteOnProposal(getUserId(principal), proposalId, request)
        );
    }

    @PostMapping("/proposals/{proposalId}/confirm")
    public ResponseEntity<TripDateProposalResponse> confirm(
            @PathVariable String proposalId,
            Principal principal) {
        return ResponseEntity.ok(
            proposalService.confirmProposal(getUserId(principal), proposalId)
        );
    }
}