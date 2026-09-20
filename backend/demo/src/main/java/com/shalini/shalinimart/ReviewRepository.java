package com.shalini.shalinimart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Integer> {

    List<Review> findByProductId(int productId);

    Optional<Review> findByProductIdAndCustomerId(
            int productId,
            int customerId
    );
}