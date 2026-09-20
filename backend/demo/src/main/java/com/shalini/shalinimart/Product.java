package com.shalini.shalinimart;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(length = 5000)
    private String description;

    private double price;

    private int stockQuantity;

    private String category;

    @Lob
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    private int sellerId;


    // ================================
    // DEFAULT CONSTRUCTOR
    // ================================

    public Product() {
    }


    // ================================
    // CONSTRUCTOR
    // ================================

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


    // ================================
    // GETTERS
    // ================================

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getSellerId() {
        return sellerId;
    }


    // ================================
    // SETTERS
    // ================================

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setSellerId(int sellerId) {
        this.sellerId = sellerId;
    }
}