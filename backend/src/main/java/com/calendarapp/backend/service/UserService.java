package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.UpdateProfileRequest;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAvatarColor() != null) {
            user.setAvatarColor(request.getAvatarColor());
        }

        userRepository.save(user);
        return mapToUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    return mapToUserResponse(user);
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public UserResponse mapToUserResponse(User user) {
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