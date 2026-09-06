package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public OrderController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }


    // ==========================================
    // F5 - CHECKOUT
    // ==========================================

    @PostMapping("/checkout/{customerId}")
    public String checkout(
            @PathVariable int customerId) {

        List<CartItem> cartItems =
                cartItemRepository.findByCustomerId(customerId);

        if (cartItems.isEmpty()) {
            return "Cart is empty!";
        }


        // Calculate total amount

        double totalAmount = 0;

        for (CartItem item : cartItems) {

            totalAmount +=
                    item.getPrice() *
                    item.getQuantity();
        }


        // Mock payment

        boolean paymentSuccessful = true;

        if (!paymentSuccessful) {
            return "Payment failed!";
        }


        // Create order

        Order order =
                new Order(
                        customerId,
                        totalAmount,
                        "CONFIRMED"
                );

        Order savedOrder =
                orderRepository.save(order);


        // Create order items

        for (CartItem cartItem : cartItems) {

            OrderItem orderItem =
                    new OrderItem(
                            savedOrder.getId(),
                            cartItem.getProductId(),
                            cartItem.getQuantity(),
                            cartItem.getPrice()
                    );

            orderItemRepository.save(orderItem);
        }


        // Clear cart

        for (CartItem cartItem : cartItems) {

            cartItemRepository.deleteById(
                    cartItem.getId()
            );
        }


        return
                "Order placed successfully! Order ID: "
                + savedOrder.getId();
    }


    // ==========================================
    // F6 - CUSTOMER ORDER HISTORY
    // ==========================================

    @GetMapping("/customer/{customerId}")
    public List<Order> getCustomerOrders(
            @PathVariable int customerId) {

        return orderRepository.findByCustomerId(
                customerId
        );
    }


    // ==========================================
    // F6 - SELLER INCOMING ORDERS
    // ==========================================

    @GetMapping("/seller/{sellerId}")
    public List<SellerOrderDTO> getSellerOrders(
            @PathVariable int sellerId) {

        List<SellerOrderDTO> sellerOrders =
                new ArrayList<>();


        // Get all orders

        List<Order> allOrders =
                orderRepository.findAll();


        // Check every order

        for (Order order : allOrders) {

            // Get items inside this order

            List<OrderItem> orderItems =
                    orderItemRepository.findByOrderId(
                            order.getId()
                    );


            // Check every product in the order

            for (OrderItem orderItem : orderItems) {

                Product product =
                        productRepository.findById(
                                orderItem.getProductId()
                        ).orElse(null);


                // Product exists?

                if (product == null) {
                    continue;
                }


                // Does this product belong
                // to the logged-in seller?

                if (product.getSellerId() == sellerId) {

                    SellerOrderDTO dto =
                            new SellerOrderDTO(
                                    order.getId(),
                                    order.getCustomerId(),
                                    product.getId(),
                                    product.getName(),
                                    orderItem.getQuantity(),
                                    orderItem.getPrice(),
                                    order.getStatus()
                            );

                    sellerOrders.add(dto);
                }
            }
        }


        return sellerOrders;
    }
}