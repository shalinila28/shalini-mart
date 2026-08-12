package com.shalini.shalinimart.service;

import com.shalini.shalinimart.model.Cart;
import com.shalini.shalinimart.model.CartItem;

import java.util.HashMap;
import java.util.Map;

public class CartService {

    private final Map<Long, Cart> carts = new HashMap<>();

    public Cart getCart(long buyerId) {
        return carts.computeIfAbsent(
                buyerId,
                id -> new Cart(0, id, null)
        );
    }

    public void addItem(long buyerId, long productId, int quantity) {
        validateQuantity(quantity);

        Cart cart = getCart(buyerId);

        for (CartItem item : cart.getItems()) {
            if (item.getProductId() == productId) {
                item.setQuantity(item.getQuantity() + quantity);
                return;
            }
        }

        cart.getItems().add(
                new CartItem(productId, quantity)
        );
    }

    public void updateItem(long buyerId, long productId, int quantity) {
        validateQuantity(quantity);

        Cart cart = getCart(buyerId);

        for (CartItem item : cart.getItems()) {
            if (item.getProductId() == productId) {
                item.setQuantity(quantity);
                return;
            }
        }

        throw new IllegalArgumentException(
                "Product is not in the cart"
        );
    }

    public void removeItem(long buyerId, long productId) {
        Cart cart = getCart(buyerId);

        boolean removed = cart.getItems().removeIf(
                item -> item.getProductId() == productId
        );

        if (!removed) {
            throw new IllegalArgumentException(
                    "Product is not in the cart"
            );
        }
    }

    public void clearCart(long buyerId) {
        getCart(buyerId).getItems().clear();
    }

    private void validateQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }
    }
}