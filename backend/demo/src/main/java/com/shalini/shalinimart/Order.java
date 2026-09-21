package com.shalini.shalinimart;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int customerId;

    private double totalAmount;

    private String status;

    private LocalDateTime orderDate;

    private String phone;

    @Column(length = 1000)
    private String address;

    public Order() {
    }

    public Order(int customerId, double totalAmount, String status) {
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = LocalDateTime.now();
    }

    public Order(int customerId, double totalAmount, String status, String phone, String address) {
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.phone = phone;
        this.address = address;
        this.orderDate = LocalDateTime.now();
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

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}