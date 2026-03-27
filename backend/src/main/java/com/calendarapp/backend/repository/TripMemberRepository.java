package com.calendarapp.backend.repository;
import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.TripMember;
import com.calendarapp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, String> {
    List<TripMember> findByTrip(Trip trip);
    List<TripMember> findByUser(User user);
    List<TripMember> findByTripAndStatus(Trip trip, TripMember.Status status);
    Optional<TripMember> findByTripAndUser(Trip trip, User user);
    boolean existsByTripAndUser(Trip trip, User user);
}