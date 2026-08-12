package com.shalini.shalinimart.ui;

import com.shalini.shalinimart.model.Cart;
import com.shalini.shalinimart.model.CartItem;
import com.shalini.shalinimart.model.Order;
import com.shalini.shalinimart.model.Product;
import com.shalini.shalinimart.model.Role;
import com.shalini.shalinimart.model.User;
import com.shalini.shalinimart.service.CartService;
import com.shalini.shalinimart.service.OrderService;
import com.shalini.shalinimart.service.ProductService;
import com.shalini.shalinimart.service.UserService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Scanner;

public class ConsoleUI {

    private final Scanner scanner = new Scanner(System.in);

    private final UserService userService;
    private final ProductService productService;
    private final CartService cartService;
    private final OrderService orderService;

    public ConsoleUI() {
        userService = new UserService();
        productService = new ProductService();
        cartService = new CartService();
        orderService = new OrderService();
    }

    public void start() {

        boolean running = true;

        while (running) {
            showMainMenu();

            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1 -> register();
                case 2 -> login();
                case 3 -> running = false;
                default -> System.out.println("Invalid choice.");
            }
        }

        System.out.println("\nThank you for using Shalini^Mart!");
        scanner.close();
    }

    private void showMainMenu() {

        System.out.println("\n================================");
        System.out.println("        WELCOME TO SHAINI^MART");
        System.out.println("================================");
        System.out.println("1. Register");
        System.out.println("2. Login");
        System.out.println("3. Exit");
        System.out.println("================================");
    }

    private void register() {

        System.out.println("\n---------- REGISTER ----------");
        System.out.println("1. Buyer");
        System.out.println("2. Seller");

        int choice = readInt("Choose account type: ");

        if (choice != 1 && choice != 2) {
            System.out.println("Invalid account type.");
            return;
        }

        String name = readString("Name: ");
        String email = readString("Email: ");
        String password = readString("Password: ");

        try {

            User user;

            if (choice == 1) {
                user = userService.registerBuyer(name, email, password);
            } else {
                user = userService.registerSeller(name, email, password);
            }

            System.out.println("\nRegistration successful!");
            System.out.println("Account ID : " + user.getId());
            System.out.println("Name       : " + user.getName());
            System.out.println("Role       : " + user.getRole());

        } catch (IllegalArgumentException e) {
            System.out.println("\nRegistration failed: " + e.getMessage());
        }
    }

    private void login() {

        System.out.println("\n---------- LOGIN ----------");

        String email = readString("Email: ");
        String password = readString("Password: ");

        User user = userService.login(email, password);

        if (user == null) {
            System.out.println("\nInvalid email or password.");
            return;
        }

        System.out.println("\nLogin successful!");
        System.out.println("Welcome, " + user.getName() + "!");

        if (user.getRole() == Role.BUYER) {
            buyerMenu(user);
        } else if (user.getRole() == Role.SELLER) {
            sellerMenu(user);
        } else if (user.getRole() == Role.ADMIN) {
            adminMenu(user);
        }
    }

    // ==================== BUYER ====================

    private void buyerMenu(User buyer) {

        boolean loggedIn = true;

        while (loggedIn) {

            System.out.println("\n========== BUYER MENU ==========");
            System.out.println("1. View Products");
            System.out.println("2. Add Product to Cart");
            System.out.println("3. View Cart");
            System.out.println("4. Place Order");
            System.out.println("5. Logout");

            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1 -> viewProducts();
                case 2 -> addToCart(buyer);
                case 3 -> viewCart(buyer);
                case 4 -> placeOrder(buyer);
                case 5 -> loggedIn = false;
                default -> System.out.println("Invalid choice.");
            }
        }

        System.out.println("Logged out successfully.");
    }

    // ==================== SELLER ====================

    private void sellerMenu(User seller) {

        boolean loggedIn = true;

        while (loggedIn) {

            System.out.println("\n========== SELLER MENU ==========");
            System.out.println("1. Add Product");
            System.out.println("2. View Products");
            System.out.println("3. Logout");

            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1 -> createProduct(seller);
                case 2 -> viewProducts();
                case 3 -> loggedIn = false;
                default -> System.out.println("Invalid choice.");
            }
        }

        System.out.println("Logged out successfully.");
    }

    // ==================== ADMIN ====================

    private void adminMenu(User admin) {

        boolean loggedIn = true;

        while (loggedIn) {

            System.out.println("\n========== ADMIN MENU ==========");
            System.out.println("Welcome, " + admin.getName());
            System.out.println("1. View Products");
            System.out.println("2. Logout");

            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1 -> viewProducts();
                case 2 -> loggedIn = false;
                default -> System.out.println("Invalid choice.");
            }
        }

        System.out.println("Logged out successfully.");
    }

    // ==================== PRODUCTS ====================

    private void createProduct(User seller) {

        System.out.println("\n---------- ADD PRODUCT ----------");

        String name = readString("Product name: ");
        String description = readString("Description: ");
        BigDecimal price = readBigDecimal("Price: ");
        int quantity = readInt("Stock quantity: ");

        try {

            Product product = productService.createProduct(
                    seller.getId(),
                    name,
                    description,
                    price,
                    quantity
            );

            System.out.println("\nProduct created successfully!");
            displayProduct(product);

        } catch (IllegalArgumentException e) {
            System.out.println("\nFailed: " + e.getMessage());
        }
    }

    private void viewProducts() {

        System.out.println("\n---------- PRODUCTS ----------");

        List<Product> products = productService.getAllProducts();

        if (products.isEmpty()) {
            System.out.println("No products available.");
            return;
        }

        for (Product product : products) {
            displayProduct(product);
        }
    }

    private void displayProduct(Product product) {

        System.out.println("--------------------------------");
        System.out.println("ID          : " + product.getId());
        System.out.println("Name        : " + product.getName());
        System.out.println("Description : " + product.getDescription());
        System.out.println("Price       : ₹" + product.getPrice());
        System.out.println("Stock       : " + product.getQuantity());
        System.out.println("--------------------------------");
    }

    // ==================== CART ====================

    private void addToCart(User buyer) {

        if (productService.getAllProducts().isEmpty()) {
            System.out.println("\nNo products available.");
            return;
        }

        viewProducts();

        long productId = readLong("Enter product ID: ");
        int quantity = readInt("Enter quantity: ");

        Product product = productService.getProductById(productId);

        if (product == null) {
            System.out.println("Product not found.");
            return;
        }

        if (quantity > product.getQuantity()) {
            System.out.println("Insufficient stock.");
            return;
        }

        try {

            cartService.addItem(
                    buyer.getId(),
                    productId,
                    quantity
            );

            System.out.println("Product added to cart!");

        } catch (IllegalArgumentException e) {
            System.out.println("Failed: " + e.getMessage());
        }
    }

    private void viewCart(User buyer) {

        System.out.println("\n---------- YOUR CART ----------");

        Cart cart = cartService.getCart(buyer.getId());

        if (cart.getItems().isEmpty()) {
            System.out.println("Your cart is empty.");
            return;
        }

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {

            Product product =
                    productService.getProductById(item.getProductId());

            if (product == null) {
                continue;
            }

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            System.out.println("--------------------------------");
            System.out.println("Product  : " + product.getName());
            System.out.println("Price    : ₹" + product.getPrice());
            System.out.println("Quantity : " + item.getQuantity());
            System.out.println("Subtotal : ₹" + subtotal);

            total = total.add(subtotal);
        }

        System.out.println("--------------------------------");
        System.out.println("TOTAL    : ₹" + total);
        System.out.println("--------------------------------");
    }

    // ==================== ORDER ====================

    private void placeOrder(User buyer) {

        Cart cart = cartService.getCart(buyer.getId());

        if (cart.getItems().isEmpty()) {
            System.out.println("\nYour cart is empty.");
            return;
        }

        System.out.println("\n---------- ORDER SUMMARY ----------");
        viewCart(buyer);

        String confirmation =
                readString("Place order? (yes/no): ");

        if (!confirmation.equalsIgnoreCase("yes")) {
            System.out.println("Order cancelled.");
            return;
        }

        try {

            Order order = orderService.placeOrder(
                    buyer.getId(),
                    cart,
                    productService
            );

            System.out.println("\n================================");
            System.out.println("     ORDER PLACED SUCCESSFULLY");
            System.out.println("================================");
            System.out.println("Order ID : " + order.getId());
            System.out.println("Total    : ₹" + order.getTotalAmount());
            System.out.println("Status   : " + order.getStatus());
            System.out.println("================================");

        } catch (IllegalArgumentException e) {
            System.out.println("\nOrder failed: " + e.getMessage());
        }
    }

    // ==================== INPUT ====================

    private String readString(String message) {
        System.out.print(message);
        return scanner.nextLine().trim();
    }

    private int readInt(String message) {

        while (true) {
            try {
                return Integer.parseInt(readString(message));
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private long readLong(String message) {

        while (true) {
            try {
                return Long.parseLong(readString(message));
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private BigDecimal readBigDecimal(String message) {

        while (true) {
            try {
                return new BigDecimal(readString(message));
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid amount.");
            }
        }
    }
}