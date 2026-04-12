package com.calendarapp.backend.service;

import com.calendarapp.backend.dto.request.LoginRequest;
import com.calendarapp.backend.dto.request.RegisterRequest;
import com.calendarapp.backend.dto.response.AuthResponse;
import com.calendarapp.backend.dto.response.UserResponse;
import com.calendarapp.backend.entity.Friendship;
import com.calendarapp.backend.entity.User;
import com.calendarapp.backend.repository.FriendshipRepository;
import com.calendarapp.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final FriendshipRepository friendshipRepository;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAvatarColor(request.getAvatarColor());
        userRepository.save(user);

        // Link any pending friendship invites sent to this email
        List<Friendship> pending = friendshipRepository.findByInviteeEmail(request.getEmail());
        for (Friendship f : pending) {
            if (f.getInvitee() == null) {
                f.setInvitee(user);
                friendshipRepository.save(f);
            }
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, mapToUserResponse(user));
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