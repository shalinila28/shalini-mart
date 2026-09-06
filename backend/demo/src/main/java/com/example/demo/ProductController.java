package com.example.demo;

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


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    @PostMapping
    public Product addProduct(@RequestBody Product product) {

        // Seller ID must be provided
        if (product.getSellerId() <= 0) {
            throw new RuntimeException(
                    "Invalid seller ID"
            );
        }

        return productRepository.save(product);
    }


    // ==========================================
    // VIEW ALL PRODUCTS
    // ==========================================

    @GetMapping
    public List<Product> getAllProducts() {

        // All sellers can VIEW all products
        return productRepository.findAll();
    }


    // ==========================================
    // EDIT PRODUCT
    // ==========================================

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable int id,
            @RequestParam int sellerId,
            @RequestBody Product updatedProduct) {

        Product product =
                productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        ));


        // ==========================================
        // CHECK PRODUCT OWNER
        // ==========================================

        if (product.getSellerId() != sellerId) {

            throw new RuntimeException(
                    "You can edit only your own products!"
            );
        }


        // ==========================================
        // UPDATE PRODUCT DETAILS
        // ==========================================

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

        product.setImageUrl(
                updatedProduct.getImageUrl()
        );


        // IMPORTANT:
        // sellerId is NOT changed

        return productRepository.save(product);
    }


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable int id,
            @RequestParam int sellerId) {

        Product product =
                productRepository.findById(id)
                .orElse(null);


        if (product == null) {

            return "Product not found";
        }


        // ==========================================
        // CHECK PRODUCT OWNER
        // ==========================================

        if (product.getSellerId() != sellerId) {

            return "You can delete only your own products!";
        }


        // ==========================================
        // DELETE
        // ==========================================

        productRepository.deleteById(id);

        return "Product deleted successfully!";
    }
}