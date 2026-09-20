package com.shalini.shalinimart;

import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int productId;

    private int customerId;

    private String customerName;

    private int rating;

    @Column(length = 2000)
    private String comment;


    // ================================
    // DEFAULT CONSTRUCTOR
    // ================================

    public Review() {
    }


    // ================================
    // CONSTRUCTOR
    // ================================

    public Review(
            int productId,
            int customerId,
            String customerName,
            int rating,
            String comment) {

        this.productId = productId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.rating = rating;
        this.comment = comment;
    }


    // ================================
    // GETTERS
    // ================================

    public int getId() {
        return id;
    }

    public int getProductId() {
        return productId;
    }

    public int getCustomerId() {
        return customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }


    // ================================
    // SETTERS
    // ================================

    public void setId(int id) {
        this.id = id;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}