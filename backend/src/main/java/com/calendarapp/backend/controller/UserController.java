package com.calendarapp.backend.controller;

import com.calendarapp.backend.dto.request.UpdateProfileRequest;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request));
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(
            @AuthenticationPrincipal User currentUser) {
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.ok("Account deleted successfully");
    }

    @GetMapping("/by-email")
        public ResponseEntity<UserResponse> getUserByEmail(
                @RequestParam String email) {
            return ResponseEntity.ok(userService.getUserByEmail(email));
        }
}