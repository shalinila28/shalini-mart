package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    // ==========================================
    // PRODUCT ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    // ==========================================
    // PRODUCT DETAILS
    // ==========================================

    private String name;

    private String description;

    private double price;

    private int stockQuantity;

    private String category;

    private String imageUrl;


    // ==========================================
    // SELLER INFORMATION
    // ==========================================

    /*
     * This stores the ID of the seller
     * who added this product.
     *
     * Example:
     *
     * Seller 1 adds Laptop
     * sellerId = 1
     *
     * Seller 2 adds Phone
     * sellerId = 2
     */

    private int sellerId;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public Product() {
    }


    // ==========================================
    // PARAMETERIZED CONSTRUCTOR
    // ==========================================

    public Product(
            String name,
            String description,
            double price,
            int stockQuantity,
            String category,
            String imageUrl,
            int sellerId) {

        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.category = category;
        this.imageUrl = imageUrl;
        this.sellerId = sellerId;
    }


    // ==========================================
    // GET ID
    // ==========================================

    public int getId() {
        return id;
    }


    // ==========================================
    // GET / SET NAME
    // ==========================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    // ==========================================
    // GET / SET DESCRIPTION
    // ==========================================

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    // ==========================================
    // GET / SET PRICE
    // ==========================================

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }


    // ==========================================
    // GET / SET STOCK
    // ==========================================

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }


    // ==========================================
    // GET / SET CATEGORY
    // ==========================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    // ==========================================
    // GET / SET IMAGE URL
    // ==========================================

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    // ==========================================
    // GET / SET SELLER ID
    // ==========================================

    public int getSellerId() {
        return sellerId;
    }

    public void setSellerId(int sellerId) {
        this.sellerId = sellerId;
    }
}