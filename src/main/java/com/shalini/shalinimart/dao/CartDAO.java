package com.shalini.shalinimart.dao;

import com.shalini.shalinimart.model.Cart;
import com.shalini.shalinimart.model.CartItem;

import java.util.Optional;

public interface CartDAO {

    Optional<Cart> findByBuyerId(long buyerId);

    void addItem(long buyerId, CartItem item);

    void updateItem(long buyerId, CartItem item);

    void removeItem(long buyerId, long productId);

    void clearCart(long buyerId);
}