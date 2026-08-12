package com.shalini.shalinimart.service;

import com.shalini.shalinimart.model.Role;
import com.shalini.shalinimart.model.User;

import java.util.ArrayList;
import java.util.List;

public class UserService {

    private final List<User> users = new ArrayList<>();
    private long nextUserId = 1;

    public UserService() {
        seedAdmin();
    }

    public User registerBuyer(String name, String email, String password) {
        return createUser(name, email, password, Role.BUYER);
    }

    public User registerSeller(String name, String email, String password) {
        return createUser(name, email, password, Role.SELLER);
    }

    public User login(String email, String password) {
        for (User user : users) {
            if (user.getEmail().equalsIgnoreCase(email)
                    && user.getPassword().equals(password)) {
                return user;
            }
        }

        return null;
    }

    private User createUser(String name, String email,
                            String password, Role role) {

        validateUserDetails(name, email, password);

        if (emailExists(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        User user = new User(
                nextUserId++,
                name,
                email,
                password,
                role
        );

        users.add(user);

        return user;
    }

    private boolean emailExists(String email) {
        for (User user : users) {
            if (user.getEmail().equalsIgnoreCase(email)) {
                return true;
            }
        }

        return false;
    }

    private void seedAdmin() {
        User admin = new User(
                nextUserId++,
                "Administrator",
                "admin@srirammart.com",
                "admin123",
                Role.ADMIN
        );

        users.add(admin);
    }

    private void validateUserDetails(String name, String email,
                                     String password) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
    }
}