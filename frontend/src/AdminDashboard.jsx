import React, { useEffect, useState } from "react";

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [activeSection, setActiveSection] = useState("users");
    const [message, setMessage] = useState("");

    // Admin ID
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    const adminId = loggedInUser?.id;

    // ==========================================
    // LOAD USERS
    // ==========================================

    const loadUsers = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/users?adminId=${adminId}`
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage("Unable to load users");
                return;
            }

            setUsers(data);

        } catch (error) {

            console.error(error);
            setMessage("Cannot connect to backend");

        }
    };


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    const loadOrders = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/orders?adminId=${adminId}`
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage("Unable to load orders");
                return;
            }

            setOrders(data);

        } catch (error) {

            console.error(error);
            setMessage("Cannot connect to backend");

        }
    };


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    const loadProducts = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/products?adminId=${adminId}`
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage("Unable to load products");
                return;
            }

            setProducts(data);

        } catch (error) {

            console.error(error);
            setMessage("Cannot connect to backend");

        }
    };


    // ==========================================
    // LOAD ALL DATA
    // ==========================================

    useEffect(() => {

        if (!adminId) {
            setMessage("Admin login required!");
            return;
        }

        loadUsers();
        loadOrders();
        loadProducts();

    }, [adminId]);


    // ==========================================
    // REMOVE PRODUCT
    // ==========================================

    const removeProduct = async (productId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to remove this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/products/${productId}?adminId=${adminId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.text();

            if (response.ok) {

                setMessage(data);

                // Refresh product list
                loadProducts();

            } else {

                setMessage(data);
            }

        } catch (error) {

            console.error(error);
            setMessage("Cannot connect to backend");

        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("loggedInUser");

        window.location.href = "/";
    };


    // ==========================================
    // ADMIN SECURITY CHECK
    // ==========================================

    if (!loggedInUser) {

        return (
            <div style={styles.center}>
                <h2>Admin Login Required</h2>
                <p>Please login first.</p>
            </div>
        );
    }


    if (loggedInUser.role !== "ADMIN") {

        return (
            <div style={styles.center}>
                <h2>Access Denied ❌</h2>
                <p>Only Admin can access this page.</p>
            </div>
        );
    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <div style={styles.page}>

            {/* HEADER */}

            <div style={styles.header}>

                <div>
                    <h1>ShaliniMart Admin Dashboard</h1>

                    <p>
                        Welcome, {loggedInUser.username} 👋
                    </p>

                    <p>
                        Admin ID: {adminId}
                    </p>
                </div>

                <button
                    style={styles.logoutButton}
                    onClick={logout}
                >
                    Logout
                </button>

            </div>


            {/* MESSAGE */}

            {message && (

                <div style={styles.message}>
                    {message}
                </div>

            )}


            {/* NAVIGATION */}

            <div style={styles.navigation}>

                <button
                    style={
                        activeSection === "users"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() => setActiveSection("users")}
                >
                    👥 Users
                </button>


                <button
                    style={
                        activeSection === "orders"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() => setActiveSection("orders")}
                >
                    📦 Orders
                </button>


                <button
                    style={
                        activeSection === "products"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() => setActiveSection("products")}
                >
                    🛍️ Products
                </button>

            </div>


            {/* ======================================
                USERS SECTION
            ====================================== */}

            {activeSection === "users" && (

                <div style={styles.section}>

                    <h2>👥 All Users</h2>

                    <p>
                        Total Users: <b>{users.length}</b>
                    </p>

                    <table style={styles.table}>

                        <thead>

                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                            </tr>

                        </thead>

                        <tbody>

                            {users.map((user) => (

                                <tr key={user.id}>

                                    <td style={styles.td}>
                                        {user.id}
                                    </td>

                                    <td style={styles.td}>
                                        {user.username}
                                    </td>

                                    <td style={styles.td}>
                                        {user.email}
                                    </td>

                                    <td style={styles.td}>
                                        {user.role}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}


            {/* ======================================
                ORDERS SECTION
            ====================================== */}

            {activeSection === "orders" && (

                <div style={styles.section}>

                    <h2>📦 All Orders</h2>

                    <p>
                        Total Orders: <b>{orders.length}</b>
                    </p>

                    <table style={styles.table}>

                        <thead>

                            <tr>
                                <th style={styles.th}>Order ID</th>
                                <th style={styles.th}>Customer ID</th>
                                <th style={styles.th}>Total Amount</th>
                                <th style={styles.th}>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {orders.map((order) => (

                                <tr key={order.id}>

                                    <td style={styles.td}>
                                        {order.id}
                                    </td>

                                    <td style={styles.td}>
                                        {order.customerId}
                                    </td>

                                    <td style={styles.td}>
                                        ₹{order.totalAmount}
                                    </td>

                                    <td style={styles.td}>
                                        {order.status}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}


            {/* ======================================
                PRODUCTS SECTION
            ====================================== */}

            {activeSection === "products" && (

                <div style={styles.section}>

                    <h2>🛍️ Product Management</h2>

                    <p>
                        Total Products: <b>{products.length}</b>
                    </p>

                    <table style={styles.table}>

                        <thead>

                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Category</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Stock</th>
                                <th style={styles.th}>Seller ID</th>
                                <th style={styles.th}>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.map((product) => (

                                <tr key={product.id}>

                                    <td style={styles.td}>
                                        {product.id}
                                    </td>

                                    <td style={styles.td}>
                                        {product.name}
                                    </td>

                                    <td style={styles.td}>
                                        {product.category}
                                    </td>

                                    <td style={styles.td}>
                                        ₹{product.price}
                                    </td>

                                    <td style={styles.td}>
                                        {product.stockQuantity}
                                    </td>

                                    <td style={styles.td}>
                                        {product.sellerId}
                                    </td>

                                    <td style={styles.td}>

                                        <button
                                            style={styles.deleteButton}
                                            onClick={() =>
                                                removeProduct(product.id)
                                            }
                                        >
                                            Remove
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
    },

    header: {
        backgroundColor: "#222",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    logoutButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    message: {
        backgroundColor: "#fff3cd",
        padding: "12px",
        marginTop: "15px",
        borderRadius: "6px"
    },

    navigation: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        marginBottom: "20px"
    },

    navButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: "#ddd"
    },

    activeButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "white"
    },

    section: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "15px"
    },

    th: {
        border: "1px solid #ddd",
        padding: "12px",
        backgroundColor: "#eee",
        textAlign: "left"
    },

    td: {
        border: "1px solid #ddd",
        padding: "12px"
    },

    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer"
    },

    center: {
        textAlign: "center",
        marginTop: "100px"
    }
};

export default AdminDashboard;