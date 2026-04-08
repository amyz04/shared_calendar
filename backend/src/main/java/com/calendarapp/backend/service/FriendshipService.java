package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.response.FriendshipResponse;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.Friendship;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.FriendshipRepository;
import com.calendarapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    // Invite by email — works whether or not invitee has an account
    public FriendshipResponse inviteByEmail(String senderId, String inviteeEmail) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Friendship friendship = new Friendship();
        friendship.setSender(sender);
        friendship.setInviteeEmail(inviteeEmail);
        friendship.setStatus(Friendship.Status.PENDING);

        // Link to user account if it exists
        userRepository.findByEmail(inviteeEmail)
                .ifPresent(friendship::setInvitee);

        friendshipRepository.save(friendship);
        return mapToResponse(friendship);
    }

    // Get sent invites where invitee has no account yet
    public List<FriendshipResponse> getSentInvites(String senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return friendshipRepository.findBySenderAndInviteeIsNull(sender).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FriendshipResponse updateStatus(String friendshipId, String status) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        if (status == null || status.isBlank()) {
            throw new RuntimeException("Status cannot be empty");
        }

        try {
            friendship.setStatus(Friendship.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Must be ACCEPTED or REJECTED");
        }

        friendshipRepository.save(friendship);
        return mapToResponse(friendship);
    }

    // Get all friendships (pending + accepted) where invitee has an account
    public List<FriendshipResponse> getFriends(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendshipResponse> all = new ArrayList<>();
        friendshipRepository.findBySender(user).stream()
                .filter(f -> f.getInvitee() != null)
                .map(this::mapToResponse).forEach(all::add);
        friendshipRepository.findByInvitee(user).stream()
                .map(this::mapToResponse).forEach(all::add);
        return all;
    }

    public void deleteFriendship(String friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));
        friendshipRepository.delete(friendship);
    }

    private FriendshipResponse mapToResponse(Friendship friendship) {
        UserResponse sender = mapToUserResponse(friendship.getSender());
        UserResponse invitee = friendship.getInvitee() != null
                ? mapToUserResponse(friendship.getInvitee())
                : null;
        return new FriendshipResponse(
                friendship.getId(),
                sender,
                invitee,
                friendship.getInviteeEmail(),
                friendship.getStatus().name(),
                friendship.getCreatedAt()
        );
    }

    private UserResponse mapToUserResponse(User user) {
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
}