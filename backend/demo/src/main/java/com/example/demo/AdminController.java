package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminController(
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    private boolean isAdmin(int adminId) {

        return userRepository.findById(adminId)
                .map(user ->
                        "ADMIN".equalsIgnoreCase(user.getRole()))
                .orElse(false);
    }


    // ==========================================
    // VIEW ALL USERS
    // ==========================================

    @GetMapping("/users")
    public Object getAllUsers(
            @RequestParam int adminId) {

        if (!isAdmin(adminId)) {
            return "Access denied! Admin only.";
        }

        return userRepository.findAll();
    }


    // ==========================================
    // VIEW ALL ORDERS
    // ==========================================

    @GetMapping("/orders")
    public Object getAllOrders(
            @RequestParam int adminId) {

        if (!isAdmin(adminId)) {
            return "Access denied! Admin only.";
        }

        return orderRepository.findAll();
    }


    // ==========================================
    // VIEW ALL PRODUCTS
    // ==========================================

    @GetMapping("/products")
    public Object getAllProducts(
            @RequestParam int adminId) {

        if (!isAdmin(adminId)) {
            return "Access denied! Admin only.";
        }

        return productRepository.findAll();
    }


    // ==========================================
    // REMOVE PRODUCT
    // ==========================================

    @DeleteMapping("/products/{id}")
    public String deleteProduct(
            @PathVariable int id,
            @RequestParam int adminId) {

        if (!isAdmin(adminId)) {
            return "Access denied! Admin only.";
        }

        if (!productRepository.existsById(id)) {
            return "Product not found!";
        }

        productRepository.deleteById(id);

        return "Product removed successfully!";
    }
}