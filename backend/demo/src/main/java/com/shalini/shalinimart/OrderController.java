package com.shalini.shalinimart;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;

    public OrderController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
    }

    // =========================================================
    // F5 - CHECKOUT
    // =========================================================

    @PostMapping("/checkout/{customerId}")
    public Object checkout(
            @PathVariable int customerId) {

        // Get customer's cart
        List<CartItem> cartItems =
                cartItemRepository.findByCustomerId(customerId);

        // Check whether cart is empty
        if (cartItems.isEmpty()) {
            return "Cart is empty!";
        }

        // Calculate total amount
        double totalAmount = 0;

        for (CartItem item : cartItems) {

            totalAmount +=
                    item.getPrice() * item.getQuantity();
        }

        // Create order
        Order order =
                new Order(
                        customerId,
                        totalAmount,
                        "CONFIRMED"
                );

        // Save order first
        Order savedOrder =
                orderRepository.save(order);

        // Create order items
        for (CartItem item : cartItems) {

            OrderItem orderItem =
                    new OrderItem(
                            savedOrder.getId(),
                            item.getProductId(),
                            item.getQuantity(),
                            item.getPrice()
                    );

            orderItemRepository.save(orderItem);
        }

        // Clear customer's cart
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }


    // =========================================================
    // F6 - CUSTOMER ORDER HISTORY
    // =========================================================

    @GetMapping("/customer/{customerId}")
    public List<Order> getCustomerOrders(
            @PathVariable int customerId) {

        return orderRepository.findByCustomerId(
                customerId
        );
    }


    // =========================================================
    // F6 - GET ORDER ITEMS
    // =========================================================

    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(
            @PathVariable int orderId) {

        return orderItemRepository.findByOrderId(
                orderId
        );
    }


    // =========================================================
    // F8 - CUSTOMER RECEIVED ORDER
    // =========================================================

    @PutMapping("/{orderId}/received")
    public Object markOrderReceived(
            @PathVariable int orderId,
            @RequestParam int customerId) {

        // Find order
        Optional<Order> optionalOrder =
                orderRepository.findById(orderId);

        // Check order exists
        if (optionalOrder.isEmpty()) {

            return "Order not found!";
        }

        Order order =
                optionalOrder.get();

        // Check whether this order belongs to this customer
        if (order.getCustomerId() != customerId) {

            return "You cannot update this order!";
        }

        // Only CONFIRMED orders can be marked as RECEIVED
        if (!"CONFIRMED".equalsIgnoreCase(
                order.getStatus())) {

            return "Only confirmed orders can be marked as received!";
        }

        // Change status
        order.setStatus("RECEIVED");

        // Save updated order
        Order updatedOrder =
                orderRepository.save(order);

        // Return updated order as JSON
        return updatedOrder;
    }
}