package com.shalini.shalinimart.dao;

import com.shalini.shalinimart.model.User;

import java.util.Optional;

public interface UserDAO {

    void save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findById(long id);
}