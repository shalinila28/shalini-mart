package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Integer> {

    List<Review> findByProductId(int productId);

    List<Review> findByCustomerId(int customerId);

    Optional<Review> findByProductIdAndCustomerId(
            int productId,
            int customerId
    );
}