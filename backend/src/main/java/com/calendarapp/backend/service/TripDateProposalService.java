package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.ProposeDateRequest;
import com.calendarapp.backend.dto.request.VoteOnProposalRequest;
import com.calendarapp.backend.dto.response.TripDateProposalResponse;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.*;
import com.calendarapp.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripDateProposalService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripDateProposalRepository proposalRepository;
    private final TripDateVoteRepository voteRepository;
    private final ItineraryRepository itineraryRepository;

    public List<TripDateProposalResponse> getProposals(String tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        return proposalRepository.findByTrip(trip)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TripDateProposalResponse proposeDate(
            String userId, String tripId, ProposeDateRequest request) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // only trip members can propose dates
        boolean isMember = trip.getMembers().stream()
                .anyMatch(m -> m.getUser().getId().equals(userId));
        if (!isMember && !trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Only trip members can propose dates");
        }

        TripDateProposal proposal = new TripDateProposal();
        proposal.setTrip(trip);
        proposal.setProposedBy(user);
        proposal.setStartDate(request.getStartDate());
        proposal.setEndDate(request.getEndDate());
        proposal.setStatus(TripDateProposal.Status.PROPOSED);
        proposalRepository.save(proposal);

        // proposer automatically agrees
        TripDateVote vote = new TripDateVote();
        vote.setProposal(proposal);
        vote.setUser(user);
        vote.setVote(TripDateVote.Vote.AGREE);
        voteRepository.save(vote);

        return mapToResponse(proposal);
    }

    @Transactional
    public TripDateProposalResponse voteOnProposal(
            String userId, String proposalId, VoteOnProposalRequest request) {

        TripDateProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update existing vote or create new one
        TripDateVote vote = voteRepository
                .findByProposalAndUser(proposal, user)
                .orElse(new TripDateVote());

        vote.setProposal(proposal);
        vote.setUser(user);
        vote.setVote(TripDateVote.Vote.valueOf(request.getVote().toUpperCase()));
        voteRepository.save(vote);

        // check if all confirmed members have agreed
        Trip trip = proposal.getTrip();
        List<TripMember> confirmedMembers = trip.getMembers().stream()
                .filter(m -> m.getStatus() == TripMember.Status.CONFIRMED)
                .collect(Collectors.toList());

        List<TripDateVote> votes = voteRepository.findByProposal(proposal);
        long agreeCount = votes.stream()
                .filter(v -> v.getVote() == TripDateVote.Vote.AGREE)
                .count();

        // if everyone agrees, confirm the proposal and update trip dates
        if (agreeCount == confirmedMembers.size()) {
            proposal.setStatus(TripDateProposal.Status.CONFIRMED);
            proposalRepository.save(proposal);

            // update trip start and end dates
            trip.setStartDate(proposal.getStartDate());
            trip.setEndDate(proposal.getEndDate());
            tripRepository.save(trip);

            // generate itineraries for each day of the trip
            generateItineraries(trip, proposal.getStartDate(), proposal.getEndDate());
        }

        return mapToResponse(proposal);
    }

    @Transactional
    public TripDateProposalResponse confirmProposal(String userId, String proposalId) {
        TripDateProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        Trip trip = proposal.getTrip();

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Only the trip owner can confirm a proposal");
        }

        proposal.setStatus(TripDateProposal.Status.CONFIRMED);
        proposalRepository.save(proposal);

        trip.setStartDate(proposal.getStartDate());
        trip.setEndDate(proposal.getEndDate());
        tripRepository.save(trip);

        generateItineraries(trip, proposal.getStartDate(), proposal.getEndDate());

        return mapToResponse(proposal);
    }

    // generates one itinerary per day between start and end date
    private void generateItineraries(Trip trip, LocalDate startDate, LocalDate endDate) {
        // delete existing itineraries first
        List<Itinerary> existing = itineraryRepository.findByTrip(trip);
        itineraryRepository.deleteAll(existing);

        int dayNumber = 1;
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            Itinerary itinerary = new Itinerary();
            itinerary.setTrip(trip);
            itinerary.setNotes("Day " + dayNumber);
            itinerary.setDate(current);
            itinerary.setDayNumber(dayNumber);
            itineraryRepository.save(itinerary);

            current = current.plusDays(1);
            dayNumber++;
        }
    }

    private UserResponse mapToUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getAvatarColor(),
                user.getDateOfBirth(),
                user.getCreatedAt()
        );
    }

    private TripDateProposalResponse mapToResponse(TripDateProposal proposal) {
        List<TripDateVote> votes = voteRepository.findByProposal(proposal);

        List<TripDateProposalResponse.VoteResponse> voteResponses = votes.stream()
                .map(v -> new TripDateProposalResponse.VoteResponse(
                        v.getId(),
                        mapToUser(v.getUser()),
                        v.getVote().name()
                ))
                .collect(Collectors.toList());

        long agreeCount = votes.stream()
                .filter(v -> v.getVote() == TripDateVote.Vote.AGREE)
                .count();
        long disagreeCount = votes.stream()
                .filter(v -> v.getVote() == TripDateVote.Vote.DISAGREE)
                .count();

        return new TripDateProposalResponse(
                proposal.getId(),
                proposal.getTrip().getId(),
                mapToUser(proposal.getProposedBy()),
                proposal.getStartDate(),
                proposal.getEndDate(),
                proposal.getStatus().name(),
                voteResponses,
                (int) agreeCount,
                (int) disagreeCount,
                proposal.getCreatedAt() != null ? proposal.getCreatedAt().toString() : null
        );
    }
}