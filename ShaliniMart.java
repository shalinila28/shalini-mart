import java.util.ArrayList;
import java.util.Scanner;

public class ShaliniMart {

    // User account class
    static class Account {
        String username;
        String password;
        String role;

        Account(String username, String password, String role) {
            this.username = username;
            this.password = password;
            this.role = role;
        }
    }

    static ArrayList<Account> accounts = new ArrayList<>();
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {

            System.out.println("\n================================");
            System.out.println("        WELCOME TO SHALINIMART");
            System.out.println("================================");
            System.out.println("1. Create Account");
            System.out.println("2. Login");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");

            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    createAccount();
                    break;

                case 2:
                    login();
                    break;

                case 3:
                    System.out.println("Thank you for using ShaliniMart!");
                    return;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }

    // ===============================
    // CREATE ACCOUNT
    // ===============================
    static void createAccount() {

        System.out.println("\n---------- CREATE ACCOUNT ----------");

        System.out.print("Enter username: ");
        String username = sc.nextLine();

        // Check username already exists
        for (Account a : accounts) {
            if (a.username.equalsIgnoreCase(username)) {
                System.out.println("Username already exists!");
                return;
            }
        }

        System.out.println("\nSelect Role:");
        System.out.println("1. User");
        System.out.println("2. Seller");
        System.out.print("Enter role: ");

        int roleChoice = sc.nextInt();
        sc.nextLine();

        String role;

        if (roleChoice == 1) {
            role = "USER";
        } else if (roleChoice == 2) {
            role = "SELLER";
        } else {
            System.out.println("Invalid role!");
            return;
        }

        System.out.print("Create password: ");
        String password = sc.nextLine();

        System.out.print("Confirm password: ");
        String confirmPassword = sc.nextLine();

        if (!password.equals(confirmPassword)) {
            System.out.println("Passwords do not match!");
            return;
        }

        // Create account
        accounts.add(new Account(username, password, role));

        System.out.println("\nAccount created successfully!");
        System.out.println("Username : " + username);
        System.out.println("Role     : " + role);
        System.out.println("You can now login.");
    }

    // ===============================
    // LOGIN
    // ===============================
    static void login() {

        System.out.println("\n------------- LOGIN -------------");

        System.out.print("Enter username: ");
        String username = sc.nextLine();

        System.out.print("Enter password: ");
        String password = sc.nextLine();

        for (Account a : accounts) {

            if (a.username.equals(username)
                    && a.password.equals(password)) {

                System.out.println("\nLogin successful!");
                System.out.println("Welcome " + a.username);

                // Open dashboard according to role
                if (a.role.equals("USER")) {
                    userDashboard(a);
                }
                else if (a.role.equals("SELLER")) {
                    sellerDashboard(a);
                }
        }

        System.out.println("\nInvalid username or password!");
    }

    // ===============================
    // USER DASHBOARD
    // ===============================
    static void userDashboard(Account account) {

        while (true) {

            System.out.println("\n================================");
            System.out.println("         USER DASHBOARD");
            System.out.println("================================");
            System.out.println("Welcome, " + account.username);
            System.out.println("1. Browse Products");
            System.out.println("2. My Cart");
            System.out.println("3. My Orders");
            System.out.println("4. Logout");

            System.out.print("Enter choice: ");
            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    System.out.println("Showing products...");
                    break;

                case 2:
                    System.out.println("Opening cart...");
                    break;

                case 3:
                    System.out.println("Showing your orders...");
                    break;

                case 4:
                    System.out.println("Logged out successfully!");
                    return;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }

    // ===============================
    // SELLER DASHBOARD
    // ===============================
    static void sellerDashboard(Account account) {

        while (true) {

            System.out.println("\n================================");
            System.out.println("        SELLER DASHBOARD");
            System.out.println("================================");
            System.out.println("Welcome, " + account.username);
            System.out.println("1. Add Product");
            System.out.println("2. Edit Product");
            System.out.println("3. Delete Product");
            System.out.println("4. View Orders");
            System.out.println("5. Logout");

            System.out.print("Enter choice: ");
            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    System.out.println("Add Product selected.");
                    break;

                case 2:
                    System.out.println("Edit Product selected.");
                    break;

                case 3:
                    System.out.println("Delete Product selected.");
                    break;

                case 4:
                    System.out.println("Showing seller orders...");
                    break;

                case 5:
                    System.out.println("Logged out successfully!");
                    return;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}