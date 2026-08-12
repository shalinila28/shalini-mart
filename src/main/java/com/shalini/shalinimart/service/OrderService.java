package com.shalini.shalinimart.service;

import com.shalini.shalinimart.model.Cart;
import com.shalini.shalinimart.model.CartItem;
import com.shalini.shalinimart.model.Order;
import com.shalini.shalinimart.model.OrderItem;
import com.shalini.shalinimart.model.OrderStatus;
import com.shalini.shalinimart.model.Product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OrderService {

    private long nextOrderId = 1;

    public Order placeOrder(long buyerId, Cart cart, ProductService productService) {

        if (cart == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {

            Product product = productService.getProductById(
                    cartItem.getProductId()
            );

            if (product == null) {
                throw new IllegalArgumentException(
                        "Product not found: " + cartItem.getProductId()
                );
            }

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product: " + product.getName()
                );
            }

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = new OrderItem(
                    product.getId(),
                    cartItem.getQuantity(),
                    product.getPrice()
            );

            orderItems.add(orderItem);
        }

        Order order = new Order(
                nextOrderId++,
                buyerId,
                totalAmount,
                OrderStatus.PLACED
        );

        for (CartItem cartItem : cart.getItems()) {

            Product product = productService.getProductById(
                    cartItem.getProductId()
            );

            product.setQuantity(
                    product.getQuantity() - cartItem.getQuantity()
            );

            productService.updateProduct(product);
        }

        cart.getItems().clear();

        return order;
    }
}