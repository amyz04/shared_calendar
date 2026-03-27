package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Friendship;
import com.calendarapp.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, String> {
    List<Friendship> findBySender(User sender);
    List<Friendship> findByInvitee(User invitee);
    Optional<Friendship> findBySenderAndInvitee(User sender, User invitee);
    boolean existsBySenderAndInvitee(User sender, User invitee);
}
