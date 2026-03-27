package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Trip;
import com.calendarapp.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    List<Trip> findByOwner(User owner);
    List<Trip> findByMembersContaining(User user);
    Optional<Trip> findByInviteToken(String inviteToken);
}
