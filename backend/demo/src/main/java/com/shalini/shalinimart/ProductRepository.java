package com.shalini.shalinimart;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository
        extends JpaRepository<Product, Integer> {

    List<Product> findBySellerId(int sellerId);

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);
}