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

    @PostMapping("/{userId}")
    public ResponseEntity<FriendshipResponse> sendRequest(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String userId) {
        return ResponseEntity.ok(friendshipService.sendRequest(currentUser.getId(), userId));
    }

    @PutMapping("/{friendshipId}")
    public ResponseEntity<FriendshipResponse> updateStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String friendshipId,
            @RequestBody UpdateFriendshipRequest request) {
        return ResponseEntity.ok(friendshipService.updateStatus(friendshipId, request.getStatus()));
    }

    @GetMapping
    public ResponseEntity<List<FriendshipResponse>> getFriends(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(friendshipService.getFriends(currentUser.getId()));
    }

    @DeleteMapping("/{friendshipId}")
    public ResponseEntity<String> deleteFriendship(
            @PathVariable String friendshipId) {
        friendshipService.deleteFriendship(friendshipId);
        return ResponseEntity.ok("Friendship deleted successfully");
    }
}