package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.TripDateProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripDateProposalRepository extends JpaRepository<TripDateProposal, String> {
    List<TripDateProposal> findByTrip(Trip trip);
    Optional<TripDateProposal> findByTripAndStatus(Trip trip, TripDateProposal.Status status);
}