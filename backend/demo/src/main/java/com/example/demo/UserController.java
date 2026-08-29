package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> userOptional =
                userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(user);
    }


    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // Check email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already registered");
        }

        // =========================
        // ADMIN SAFETY CHECK
        // =========================
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            // Check whether an Admin already exists
            if (userRepository.existsByRole("ADMIN")) {
                return ResponseEntity
                        .badRequest()
                        .body("Admin already exists. Only one Admin is allowed.");
            }
        }

        // Save user
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }
}