package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        // Check whether email already exists
        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return "Email already registered!";
        }

        // ------------------------------------------
        // ADMIN SAFETY CHECK
        // ------------------------------------------

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            return "Admin registration is not allowed!";
        }

        // Allow only CUSTOMER and SELLER
        if (!"CUSTOMER".equalsIgnoreCase(user.getRole())
                && !"SELLER".equalsIgnoreCase(user.getRole())) {

            return "Invalid role!";
        }

        // Save user
        userRepository.save(user);

        return "Registration Successful!";
    }


    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public Object login(@RequestBody User loginUser) {

        // Find user using email
        Optional<User> optionalUser =
                userRepository.findByEmail(loginUser.getEmail());

        // Email not found
        if (optionalUser.isEmpty()) {

            return "Invalid Email or Password";
        }

        User user = optionalUser.get();

        // Check password
        if (!user.getPassword()
                .equals(loginUser.getPassword())) {

            return "Invalid Email or Password";
        }

        // Login successful
        return user;
    }
}