package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public ReviewController(
            ReviewRepository reviewRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {

        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // =====================================================
    // CHECK WHETHER CUSTOMER CAN REVIEW A PRODUCT
    // =====================================================

    @GetMapping("/can-review")
    public boolean canReview(
            @RequestParam int customerId,
            @RequestParam int productId) {

        return customerReceivedProduct(
                customerId,
                productId
        );
    }


    // =====================================================
    // GET ALL REVIEWS FOR ONE PRODUCT
    // =====================================================

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(
            @PathVariable int productId) {

        return reviewRepository.findByProductId(productId);
    }


    // =====================================================
    // GET ALL REVIEWS BY ONE CUSTOMER
    // =====================================================

    @GetMapping("/customer/{customerId}")
    public List<Review> getCustomerReviews(
            @PathVariable int customerId) {

        return reviewRepository.findByCustomerId(customerId);
    }


    // =====================================================
    // ADD REVIEW
    // =====================================================

    @PostMapping
    public Object addReview(
            @RequestBody Review review) {

        // Check rating
        if (review.getRating() < 1 ||
                review.getRating() > 5) {

            return "Rating must be between 1 and 5.";
        }


        // Check customer received product
        if (!customerReceivedProduct(
                review.getCustomerId(),
                review.getProductId())) {

            return "You can review this product only after receiving it.";
        }


        // Check duplicate review
        Optional<Review> existingReview =
                reviewRepository.findByProductIdAndCustomerId(
                        review.getProductId(),
                        review.getCustomerId()
                );


        if (existingReview.isPresent()) {

            return "You have already reviewed this product.";
        }


        // Save review
        Review savedReview =
                reviewRepository.save(review);

        return savedReview;
    }


    // =====================================================
    // UPDATE OWN REVIEW
    // =====================================================

    @PutMapping("/{id}")
    public Object updateReview(
            @PathVariable int id,
            @RequestParam int customerId,
            @RequestBody Review updatedReview) {

        Optional<Review> optionalReview =
                reviewRepository.findById(id);


        if (optionalReview.isEmpty()) {

            return "Review not found.";
        }


        Review review =
                optionalReview.get();


        // Only review owner can edit
        if (review.getCustomerId() != customerId) {

            return "You can edit only your own review.";
        }


        // Rating validation
        if (updatedReview.getRating() < 1 ||
                updatedReview.getRating() > 5) {

            return "Rating must be between 1 and 5.";
        }


        review.setRating(
                updatedReview.getRating()
        );

        review.setComment(
                updatedReview.getComment()
        );


        return reviewRepository.save(review);
    }


    // =====================================================
    // DELETE OWN REVIEW
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteReview(
            @PathVariable int id,
            @RequestParam int customerId) {

        Optional<Review> optionalReview =
                reviewRepository.findById(id);


        if (optionalReview.isEmpty()) {

            return "Review not found.";
        }


        Review review =
                optionalReview.get();


        // Only owner can delete
        if (review.getCustomerId() != customerId) {

            return "You can delete only your own review.";
        }


        reviewRepository.deleteById(id);

        return "Review deleted successfully!";
    }


    // =====================================================
    // CHECK WHETHER CUSTOMER RECEIVED PRODUCT
    // =====================================================

    private boolean customerReceivedProduct(
            int customerId,
            int productId) {

        List<Order> orders =
                orderRepository.findByCustomerId(
                        customerId
                );


        for (Order order : orders) {

            // Review allowed only when order is RECEIVED
            if (!"RECEIVED".equalsIgnoreCase(
                    order.getStatus())) {

                continue;
            }


            List<OrderItem> items =
                    orderItemRepository.findByOrderId(
                            order.getId()
                    );


            for (OrderItem item : items) {

                if (item.getProductId() == productId) {

                    return true;
                }
            }
        }


        return false;
    }
}