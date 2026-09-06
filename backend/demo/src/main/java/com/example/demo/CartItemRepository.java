package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCustomerId(int customerId);

    Optional<CartItem> findByCustomerIdAndProductId(
            int customerId,
            int productId
    );
}