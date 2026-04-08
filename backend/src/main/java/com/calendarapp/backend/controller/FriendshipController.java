package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.UpdateFriendshipRequest;
import com.calendarapp.backend.dto.response.FriendshipResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @PostMapping("/invite")
    public ResponseEntity<FriendshipResponse> inviteByEmail(
            @AuthenticationPrincipal User currentUser,
            @RequestParam String email) {
        return ResponseEntity.ok(friendshipService.inviteByEmail(currentUser.getId(), email));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<FriendshipResponse>> getSentInvites(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(friendshipService.getSentInvites(currentUser.getId()));
    }

    @GetMapping
    public ResponseEntity<List<FriendshipResponse>> getFriends(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(friendshipService.getFriends(currentUser.getId()));
    }

    @PutMapping("/{friendshipId}")
    public ResponseEntity<FriendshipResponse> updateStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String friendshipId,
            @RequestBody UpdateFriendshipRequest request) {
        return ResponseEntity.ok(friendshipService.updateStatus(friendshipId, request.getStatus()));
    }

    @DeleteMapping("/{friendshipId}")
    public ResponseEntity<String> deleteFriendship(
            @PathVariable String friendshipId) {
        friendshipService.deleteFriendship(friendshipId);
        return ResponseEntity.ok("Friendship deleted successfully");
    }
}