package com.calendarapp.backend.repository;

import com.calendarapp.backend.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, String> {
    Optional<Friendship> findBySender(String sender);

    Optional<Friendship> findByInvitee(String invitee);

    boolean existsBySender(String sender);

    boolean existsByInvitee(String invitee);
}
