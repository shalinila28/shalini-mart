import React from "react";
import { useNavigate } from "react-router-dom";

function SellerDashboard() {

    const navigate = useNavigate();

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    // ------------------------------------------
    // LOGIN CHECK
    // ------------------------------------------

    if (!loggedInUser) {
        navigate("/login");
        return null;
    }

    // ------------------------------------------
    // SELLER CHECK
    // ------------------------------------------

    const role = loggedInUser.role
        ? String(loggedInUser.role).trim().toUpperCase()
        : "";

    if (role !== "SELLER") {
        navigate("/");
        return null;
    }

    // ------------------------------------------
    // LOGOUT
    // ------------------------------------------

    const logout = () => {

        localStorage.removeItem("loggedInUser");

        navigate("/login");
    };

    return (

        <div style={styles.page}>

            {/* ================= HEADER ================= */}

            <div style={styles.header}>

                <div>

                    <h1 style={styles.logo}>
                        🛒 ShaliniMart
                    </h1>

                    <h2 style={styles.title}>
                        Seller Dashboard
                    </h2>

                    <p style={styles.welcome}>
                        Welcome,{" "}
                        <strong>
                            {loggedInUser.username}
                        </strong>
                    </p>

                </div>

                <button
                    style={styles.logout}
                    onClick={logout}
                >
                    Logout
                </button>

            </div>


            {/* ================= TITLE ================= */}

            <h2 style={styles.sectionTitle}>
                🏪 Seller Management
            </h2>


            {/* ================= SELLER OPTIONS ================= */}

            <div style={styles.grid}>

                {/* ================= ADD PRODUCT ================= */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        ➕
                    </div>

                    <h2 style={styles.cardTitle}>
                        Add Product
                    </h2>

                    <p style={styles.cardText}>
                        List new products to your store catalog with title, description, price, stock, category, and image.
                    </p>

                    <button
                        style={styles.addButton}
                        onClick={() =>
                            navigate("/seller/products/add")
                        }
                    >
                        ➕ Add Product
                    </button>

                </div>


                {/* ================= MY PRODUCTS ================= */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        🛍️
                    </div>

                    <h2 style={styles.cardTitle}>
                        My Products
                    </h2>

                    <p style={styles.cardText}>
                        View all your active inventory items, edit pricing or details, and manage your product listings.
                    </p>

                    <button
                        style={styles.viewButton}
                        onClick={() =>
                            navigate("/seller/products")
                        }
                    >
                        🛍️ View My Products
                    </button>

                </div>


                {/* ================= INCOMING ORDERS ================= */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        📦
                    </div>

                    <h2 style={styles.cardTitle}>
                        Incoming Orders
                    </h2>

                    <p style={styles.cardText}>
                        View and manage customer orders placed for your products.
                    </p>

                    <button
                        style={styles.orderButton}
                        onClick={() =>
                            navigate("/seller/orders")
                        }
                    >
                        📦 View Orders
                    </button>

                </div>

            </div>

        </div>
    );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

    page: {
        minHeight: "100vh",
        padding: "35px",
        fontFamily: "Arial, sans-serif",
        background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",
        color: "#172033",
        boxSizing: "border-box"
    },


    /* ================= HEADER ================= */

    header: {
        background:
            "linear-gradient(135deg, #172554, #2563eb)",
        color: "white",
        padding: "30px",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow:
            "0 10px 30px rgba(37, 99, 235, 0.25)",
        marginBottom: "40px"
    },


    logo: {
        margin: "0 0 8px 0",
        fontSize: "32px"
    },


    title: {
        margin: "5px 0",
        fontSize: "25px"
    },


    welcome: {
        margin: "10px 0 0 0",
        fontSize: "17px"
    },


    logout: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "13px 25px",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer"
    },


    /* ================= SECTION ================= */

    sectionTitle: {
        textAlign: "center",
        fontSize: "28px",
        marginBottom: "30px",
        color: "#172554"
    },


    /* ================= GRID ================= */

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        maxWidth: "900px",
        margin: "auto"
    },


    /* ================= CARD ================= */

    card: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "35px 25px",
        textAlign: "center",
        boxShadow:
            "0 8px 25px rgba(0, 0, 0, 0.12)",
        border: "1px solid #e5e7eb"
    },


    icon: {
        fontSize: "55px",
        marginBottom: "15px"
    },


    cardTitle: {
        fontSize: "23px",
        color: "#172554",
        marginBottom: "10px"
    },


    cardText: {
        color: "#475569",
        fontSize: "15px",
        lineHeight: "1.5",
        minHeight: "45px",
        marginBottom: "20px"
    },


    /* ================= ADD PRODUCT ================= */

    addButton: {
        width: "100%",
        marginTop: "8px",
        padding: "13px 20px",
        background:
            "linear-gradient(135deg, #16a34a, #15803d)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    },


    /* ================= VIEW PRODUCTS ================= */

    viewButton: {
        width: "100%",
        marginTop: "12px",
        padding: "13px 20px",
        background:
            "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    },


    /* ================= ORDERS ================= */

    orderButton: {
        width: "100%",
        marginTop: "20px",
        padding: "13px 20px",
        background:
            "linear-gradient(135deg, #7c3aed, #6d28d9)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    }

};

export default SellerDashboard;