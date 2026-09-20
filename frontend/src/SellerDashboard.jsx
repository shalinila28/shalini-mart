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

    if (loggedInUser.role !== "SELLER") {
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

                {/* ADD PRODUCT */}

                <div
                    style={styles.card}
                    onClick={() =>
                        navigate("/seller/products/add")
                    }
                >

                    <div style={styles.icon}>
                        ➕
                    </div>

                    <h2 style={styles.cardTitle}>
                        Add Product
                    </h2>

                    <p style={styles.cardText}>
                        Add a new product to ShaliniMart
                    </p>

                    <button
                        style={styles.button}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/seller/products/add");
                        }}
                    >
                        Add Product
                    </button>

                </div>


                {/* MY PRODUCTS */}

                <div
                    style={styles.card}
                    onClick={() =>
                        navigate("/seller/products")
                    }
                >

                    <div style={styles.icon}>
                        🛍️
                    </div>

                    <h2 style={styles.cardTitle}>
                        My Products
                    </h2>

                    <p style={styles.cardText}>
                        View, edit and delete your products
                    </p>

                    <button
                        style={styles.button}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/seller/products");
                        }}
                    >
                        View Products
                    </button>

                </div>


                {/* INCOMING ORDERS */}

                <div
                    style={styles.card}
                    onClick={() =>
                        navigate("/seller/orders")
                    }
                >

                    <div style={styles.icon}>
                        📦
                    </div>

                    <h2 style={styles.cardTitle}>
                        Incoming Orders
                    </h2>

                    <p style={styles.cardText}>
                        View and manage customer orders
                    </p>

                    <button
                        style={styles.button}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/seller/orders");
                        }}
                    >
                        View Orders
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
        color: "#172033"
    },

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

    sectionTitle: {
        textAlign: "center",
        fontSize: "28px",
        marginBottom: "30px",
        color: "#172554"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "30px",
        maxWidth: "1100px",
        margin: "auto"
    },

    card: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "35px 25px",
        textAlign: "center",
        boxShadow:
            "0 8px 25px rgba(0, 0, 0, 0.12)",
        cursor: "pointer",
        transition: "0.3s",
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
        minHeight: "45px"
    },

    button: {
        marginTop: "20px",
        background:
            "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        border: "none",
        padding: "13px 25px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    }
};

export default SellerDashboard;