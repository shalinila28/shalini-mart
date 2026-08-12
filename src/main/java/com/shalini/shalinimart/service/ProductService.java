package com.shalini.shalinimart.service;

import com.shalini.shalinimart.model.Product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductService {

    private final List<Product> products = new ArrayList<>();
    private long nextProductId = 1;

    public Product createProduct(long sellerId, String name,
                                 String description, BigDecimal price,
                                 int quantity) {

        validateProductDetails(name, price, quantity);

        Product product = new Product(
                nextProductId++,
                sellerId,
                name,
                description,
                price,
                quantity
        );

        products.add(product);

        return product;
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(products);
    }

    public Product getProductById(long id) {
        for (Product product : products) {
            if (product.getId() == id) {
                return product;
            }
        }

        return null;
    }

    public void updateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }

        validateProductDetails(
                product.getName(),
                product.getPrice(),
                product.getQuantity()
        );

        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getId() == product.getId()) {
                products.set(i, product);
                return;
            }
        }

        throw new IllegalArgumentException("Product not found");
    }

    public void deleteProduct(long id) {
        Product product = getProductById(id);

        if (product == null) {
            throw new IllegalArgumentException("Product not found");
        }

        products.remove(product);
    }

    private void validateProductDetails(String name,
                                        BigDecimal price,
                                        int quantity) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }

        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
    }
}