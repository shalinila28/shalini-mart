package com.shalini.shalinimart;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartItemRepository cartItemRepository;

    public CartController(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    // =========================
    // VIEW CART
    // =========================

    @GetMapping("/{customerId}")
    public List<CartItem> getCart(
            @PathVariable int customerId) {

        return cartItemRepository
                .findByCustomerId(customerId);
    }


    // =========================
    // ADD TO CART
    // =========================

    @PostMapping
    public CartItem addToCart(
            @RequestBody CartItem cartItem) {

        var existingItem =
                cartItemRepository
                        .findByCustomerIdAndProductId(
                                cartItem.getCustomerId(),
                                cartItem.getProductId()
                        );

        if (existingItem.isPresent()) {

            CartItem item = existingItem.get();

            item.setQuantity(
                    item.getQuantity()
                    + cartItem.getQuantity()
            );

            return cartItemRepository.save(item);
        }

        return cartItemRepository.save(cartItem);
    }


    // =========================
    // UPDATE QUANTITY
    // =========================

    @PutMapping("/{id}")
    public CartItem updateQuantity(
            @PathVariable int id,
            @RequestBody CartItem updatedItem) {

        CartItem item =
                cartItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item not found"
                        ));

        item.setQuantity(
                updatedItem.getQuantity()
        );

        return cartItemRepository.save(item);
    }


    // =========================
    // REMOVE FROM CART
    // =========================

    @DeleteMapping("/{id}")
    public String removeFromCart(
            @PathVariable int id) {

        if (!cartItemRepository.existsById(id)) {
            return "Cart item not found";
        }

        cartItemRepository.deleteById(id);

        return "Item removed from cart!";
    }
}