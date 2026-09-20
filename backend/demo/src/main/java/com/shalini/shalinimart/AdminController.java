package com.shalini.shalinimart;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    public AdminController(
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            ReviewRepository reviewRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
    }


    // =====================================================
    // 1. VIEW ALL USERS
    // =====================================================

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =====================================================
    // 2. VIEW ONE USER
    // =====================================================

    @GetMapping("/users/{id}")
    public Object getUser(
            @PathVariable int id) {

        Optional<User> user =
                userRepository.findById(id);

        if (user.isEmpty()) {

            return "User not found!";
        }

        return user.get();
    }


    // =====================================================
    // 3. DELETE USER
    // =====================================================

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable int id) {

        Optional<User> optionalUser =
                userRepository.findById(id);

        if (optionalUser.isEmpty()) {

            return "User not found!";
        }

        User user =
                optionalUser.get();

        // -------------------------------------------------
        // ADMIN PROTECTION
        // -------------------------------------------------

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            return "Admin account cannot be deleted!";
        }

        userRepository.deleteById(id);

        return "User deleted successfully!";
    }


    // =====================================================
    // 4. VIEW ALL PRODUCTS
    // =====================================================

    @GetMapping("/products")
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }


    // =====================================================
    // 5. VIEW ONE PRODUCT
    // =====================================================

    @GetMapping("/products/{id}")
    public Object getProduct(
            @PathVariable int id) {

        Optional<Product> product =
                productRepository.findById(id);

        if (product.isEmpty()) {

            return "Product not found!";
        }

        return product.get();
    }


    // =====================================================
    // 6. DELETE ANY PRODUCT
    // =====================================================

    @DeleteMapping("/products/{id}")
    public String deleteProduct(
            @PathVariable int id) {

        Optional<Product> product =
                productRepository.findById(id);

        if (product.isEmpty()) {

            return "Product not found!";
        }

        productRepository.deleteById(id);

        return "Product deleted successfully!";
    }


    // =====================================================
    // 7. VIEW ALL ORDERS
    // =====================================================

    @GetMapping("/orders")
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // =====================================================
    // 8. VIEW ONE ORDER
    // =====================================================

    @GetMapping("/orders/{id}")
    public Object getOrder(
            @PathVariable int id) {

        Optional<Order> order =
                orderRepository.findById(id);

        if (order.isEmpty()) {

            return "Order not found!";
        }

        return order.get();
    }


    // =====================================================
    // 9. VIEW ALL REVIEWS
    // =====================================================

    @GetMapping("/reviews")
    public List<Review> getAllReviews() {

        return reviewRepository.findAll();
    }


    // =====================================================
    // 10. VIEW REVIEWS FOR ONE PRODUCT
    // =====================================================

    @GetMapping("/reviews/product/{productId}")
    public List<Review> getProductReviews(
            @PathVariable int productId) {

        return reviewRepository.findByProductId(
                productId
        );
    }


    // =====================================================
    // 11. DELETE ANY REVIEW
    // =====================================================

    @DeleteMapping("/reviews/{id}")
    public String deleteReview(
            @PathVariable int id) {

        Optional<Review> review =
                reviewRepository.findById(id);

        if (review.isEmpty()) {

            return "Review not found!";
        }

        reviewRepository.deleteById(id);

        return "Review deleted successfully!";
    }


    // =====================================================
    // 12. ADMIN DASHBOARD SUMMARY
    // =====================================================

    @GetMapping("/summary")
    public AdminSummary getSummary() {

        long totalUsers =
                userRepository.count();

        long totalProducts =
                productRepository.count();

        long totalOrders =
                orderRepository.count();

        long totalReviews =
                reviewRepository.count();

        return new AdminSummary(
                totalUsers,
                totalProducts,
                totalOrders,
                totalReviews
        );
    }


    // =====================================================
    // SUMMARY CLASS
    // =====================================================

    public static class AdminSummary {

        private long totalUsers;
        private long totalProducts;
        private long totalOrders;
        private long totalReviews;


        public AdminSummary(
                long totalUsers,
                long totalProducts,
                long totalOrders,
                long totalReviews) {

            this.totalUsers =
                    totalUsers;

            this.totalProducts =
                    totalProducts;

            this.totalOrders =
                    totalOrders;

            this.totalReviews =
                    totalReviews;
        }


        public long getTotalUsers() {

            return totalUsers;
        }


        public long getTotalProducts() {

            return totalProducts;
        }


        public long getTotalOrders() {

            return totalOrders;
        }


        public long getTotalReviews() {

            return totalReviews;
        }
    }
}