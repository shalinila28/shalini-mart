package com.shalini.shalinimart;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ReviewController {

    private final ReviewRepository reviewRepository;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public ReviewController(
            ReviewRepository reviewRepository) {

        this.reviewRepository = reviewRepository;
    }


    // =========================================
    // GET ALL REVIEWS
    // =========================================

    @GetMapping
    public List<Review> getAllReviews() {

        return reviewRepository.findAll();
    }


    // =========================================
    // GET REVIEWS FOR ONE PRODUCT
    // =========================================

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(
            @PathVariable int productId) {

        return reviewRepository
                .findByProductId(productId);
    }


    // =========================================
    // CHECK CUSTOMER'S REVIEW
    // =========================================

    @GetMapping("/product/{productId}/customer/{customerId}")
    public Review getCustomerReview(
            @PathVariable int productId,
            @PathVariable int customerId) {

        return reviewRepository
                .findByProductIdAndCustomerId(
                        productId,
                        customerId
                )
                .orElse(null);
    }


    // =========================================
    // ADD REVIEW
    // =========================================

    @PostMapping
    public Review addReview(
            @RequestBody Review review) {

        // Check whether customer already reviewed
        // this product

        Review existing =
                reviewRepository
                        .findByProductIdAndCustomerId(
                                review.getProductId(),
                                review.getCustomerId()
                        )
                        .orElse(null);


        if (existing != null) {

            throw new RuntimeException(
                    "You have already reviewed this product. Edit your existing review."
            );
        }


        // Validate rating

        if (review.getRating() < 1 ||
                review.getRating() > 5) {

            throw new RuntimeException(
                    "Rating must be between 1 and 5."
            );
        }


        return reviewRepository.save(review);
    }


    // =========================================
    // UPDATE OWN REVIEW
    // =========================================

    @PutMapping("/{reviewId}")
    public Review updateReview(
            @PathVariable int reviewId,
            @RequestParam int customerId,
            @RequestBody Review updatedReview) {


        Review existing =
                reviewRepository
                        .findById(reviewId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Review not found."
                                )
                        );


        // =====================================
        // OWNER CHECK
        // =====================================

        if (existing.getCustomerId() != customerId) {

            throw new RuntimeException(
                    "You can edit only your own review."
            );
        }


        // =====================================
        // VALIDATE RATING
        // =====================================

        if (updatedReview.getRating() < 1 ||
                updatedReview.getRating() > 5) {

            throw new RuntimeException(
                    "Rating must be between 1 and 5."
            );
        }


        // =====================================
        // UPDATE
        // =====================================

        existing.setRating(
                updatedReview.getRating()
        );

        existing.setComment(
                updatedReview.getComment()
        );


        return reviewRepository.save(existing);
    }


    // =========================================
    // DELETE OWN REVIEW
    // =========================================

    @DeleteMapping("/{reviewId}")
    public String deleteReview(
            @PathVariable int reviewId,
            @RequestParam int customerId) {


        Review existing =
                reviewRepository
                        .findById(reviewId)
                        .orElse(null);


        if (existing == null) {

            return "Review not found.";
        }


        // =====================================
        // OWNER CHECK
        // =====================================

        if (existing.getCustomerId() != customerId) {

            return "You can delete only your own review.";
        }


        reviewRepository.deleteById(reviewId);


        return "Review deleted successfully.";
    }
}