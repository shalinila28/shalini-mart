package com.shalini.shalinimart;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int customerId;

    private int productId;

    private int quantity;

    private double price;

    private String color;

    private String size;

    public CartItem() {
    }

    public CartItem(int customerId, int productId,
                    int quantity, double price) {

        this.customerId = customerId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    public CartItem(int customerId, int productId,
                    int quantity, double price,
                    String color, String size) {

        this.customerId = customerId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.color = color;
        this.size = size;
    }

    public int getId() {
        return id;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}