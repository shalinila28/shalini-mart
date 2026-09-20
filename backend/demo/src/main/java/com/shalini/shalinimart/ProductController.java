package com.shalini.shalinimart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;


    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestBody Product product) {

        try {

            if (product.getSellerId() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid seller ID");
            }

            Product savedProduct =
                    productRepository.save(product);

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Error adding product: "
                            + e.getMessage());
        }
    }


    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllProducts() {

        try {

            List<Product> products =
                    productRepository.findAll();

            return ResponseEntity.ok(products);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Error loading products");
        }
    }


    // =====================================================
    // GET ONE PRODUCT
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(
            @PathVariable int id) {

        try {

            return productRepository
                    .findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() ->
                            ResponseEntity
                                    .notFound()
                                    .build());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Error loading product");
        }
    }


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,
            @RequestParam int sellerId,
            @RequestBody Product updatedProduct) {

        try {

            // ---------------------------------------------
            // FIND PRODUCT
            // ---------------------------------------------

            Product product =
                    productRepository
                            .findById(id)
                            .orElse(null);


            if (product == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            // ---------------------------------------------
            // CHECK SELLER
            // ---------------------------------------------

            if (product.getSellerId() != sellerId) {

                return ResponseEntity
                        .status(403)
                        .body(
                                "You can edit only your own products!"
                        );
            }


            // ---------------------------------------------
            // UPDATE BASIC DETAILS
            // ---------------------------------------------

            product.setName(
                    updatedProduct.getName()
            );

            product.setDescription(
                    updatedProduct.getDescription()
            );

            product.setPrice(
                    updatedProduct.getPrice()
            );

            product.setStockQuantity(
                    updatedProduct.getStockQuantity()
            );

            product.setCategory(
                    updatedProduct.getCategory()
            );


            // ---------------------------------------------
            // UPDATE IMAGE ONLY IF NEW IMAGE EXISTS
            // ---------------------------------------------

            if (updatedProduct.getImageUrl() != null
                    && !updatedProduct
                    .getImageUrl()
                    .trim()
                    .isEmpty()) {

                product.setImageUrl(
                        updatedProduct.getImageUrl()
                );
            }


            // ---------------------------------------------
            // NEVER CHANGE SELLER ID
            // ---------------------------------------------

            product.setSellerId(
                    sellerId
            );


            // ---------------------------------------------
            // SAVE
            // ---------------------------------------------

            Product savedProduct =
                    productRepository.save(product);

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error updating product: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable int id,
            @RequestParam int sellerId) {

        try {

            Product product =
                    productRepository
                            .findById(id)
                            .orElse(null);


            if (product == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            if (product.getSellerId() != sellerId) {

                return ResponseEntity
                        .status(403)
                        .body(
                                "You can delete only your own products!"
                        );
            }


            productRepository.delete(product);

            return ResponseEntity.ok(
                    "Product deleted successfully!"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error deleting product: "
                                    + e.getMessage()
                    );
        }
    }
}