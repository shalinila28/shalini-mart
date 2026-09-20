package com.shalini.shalinimart;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return "Email already registered!";
        }


        // ADMIN CANNOT REGISTER
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {

            return "Admin registration is not allowed!";
        }


        // ONLY CUSTOMER AND SELLER
        if (!"CUSTOMER".equalsIgnoreCase(user.getRole())
                && !"SELLER".equalsIgnoreCase(user.getRole())) {

            return "Invalid role!";
        }


        userRepository.save(user);

        return "Registration Successful!";
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public Object login(
            @RequestBody User loginUser,
            HttpSession session) {

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        loginUser.getEmail()
                );


        if (optionalUser.isEmpty()) {

            return "Invalid Email or Password";
        }


        User user = optionalUser.get();


        if (!user.getPassword()
                .equals(loginUser.getPassword())) {

            return "Invalid Email or Password";
        }


        // =================================================
        // IMPORTANT
        // STORE REAL USER IN SERVER SESSION
        // =================================================

        session.setAttribute(
                "userId",
                user.getId()
        );

        session.setAttribute(
                "username",
                user.getUsername()
        );

        session.setAttribute(
                "role",
                user.getRole()
        );


        // Return only information React needs for display
        Map<String, Object> response =
                new HashMap<>();

        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }


    // =====================================================
    // CURRENT LOGGED-IN USER
    // =====================================================

    @GetMapping("/me")
    public Object getCurrentUser(
            HttpSession session) {

        Object userId =
                session.getAttribute("userId");


        if (userId == null) {

            return "Not logged in";
        }


        Map<String, Object> user =
                new HashMap<>();

        user.put(
                "id",
                session.getAttribute("userId")
        );

        user.put(
                "username",
                session.getAttribute("username")
        );

        user.put(
                "role",
                session.getAttribute("role")
        );


        return user;
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    @PostMapping("/logout")
    public String logout(
            HttpSession session) {

        session.invalidate();

        return "Logout successful!";
    }
}