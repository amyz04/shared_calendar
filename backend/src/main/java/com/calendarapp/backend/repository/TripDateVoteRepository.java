package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.TripDateProposal;
import com.calendarapp.backend.entity.TripDateVote;
import com.calendarapp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripDateVoteRepository extends JpaRepository<TripDateVote, String> {
    List<TripDateVote> findByProposal(TripDateProposal proposal);
    Optional<TripDateVote> findByProposalAndUser(TripDateProposal proposal, User user);
    boolean existsByProposalAndUser(TripDateProposal proposal, User user);
}