package com.example.demo;

public class SellerOrderDTO {

    private int orderId;
    private int customerId;
    private int productId;
    private String productName;
    private int quantity;
    private double price;
    private String status;

    public SellerOrderDTO() {
    }

    public SellerOrderDTO(
            int orderId,
            int customerId,
            int productId,
            String productName,
            int quantity,
            double price,
            String status) {

        this.orderId = orderId;
        this.customerId = customerId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.status = status;
    }

    public int getOrderId() {
        return orderId;
    }

    public int getCustomerId() {
        return customerId;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public String getStatus() {
        return status;
    }
}