package com.shalini.shalinimart.dao;

import com.shalini.shalinimart.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductDAO {

    void save(Product product);

    Optional<Product> findById(long id);

    List<Product> findAll();

    void update(Product product);

    void delete(long id);
}