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

    public FriendshipResponse sendRequest(String senderId, String inviteeId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User invitee = userRepository.findById(inviteeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Friendship friendship = new Friendship();
        friendship.setSender(sender);
        friendship.setInvitee(invitee);
        friendship.setStatus(Friendship.Status.PENDING);

        friendshipRepository.save(friendship);
        return mapToResponse(friendship);
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

    public List<FriendshipResponse> getFriends(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendshipResponse> all = new ArrayList<>();
        friendshipRepository.findBySender(user).stream()
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
        UserResponse sender = new UserResponse(
                friendship.getSender().getId(),
                friendship.getSender().getFirstName(),
                friendship.getSender().getLastName(),
                friendship.getSender().getEmail(),
                friendship.getSender().getAvatarColor(),
                friendship.getSender().getDateOfBirth(),
                friendship.getSender().getCreatedAt()
        );

        UserResponse invitee = new UserResponse(
                friendship.getInvitee().getId(),
                friendship.getInvitee().getFirstName(),
                friendship.getInvitee().getLastName(),
                friendship.getInvitee().getEmail(),
                friendship.getInvitee().getAvatarColor(),
                friendship.getInvitee().getDateOfBirth(),
                friendship.getInvitee().getCreatedAt()
        );

        return new FriendshipResponse(
                friendship.getId(),
                sender,
                invitee,
                friendship.getStatus().name(),
                friendship.getCreatedAt()
        );
    }
}