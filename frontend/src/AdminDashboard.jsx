import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );


    // =====================================================
    // SUMMARY
    // =====================================================

    const [summary, setSummary] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalReviews: 0
    });


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // CHECK ADMIN LOGIN
    // =====================================================

    useEffect(() => {

        if (!loggedInUser) {

            navigate("/login");

            return;
        }


        if (
            !loggedInUser.role ||
            loggedInUser.role.toUpperCase() !== "ADMIN"
        ) {

            navigate("/");

            return;
        }


        loadSummary();

    }, []);


    // =====================================================
    // LOAD ADMIN SUMMARY
    // =====================================================

    const loadSummary = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                "http://localhost:8080/api/admin/summary"
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load dashboard data"
                );
            }


            const data = await response.json();


            setSummary({

                totalUsers:
                    data.totalUsers ?? 0,

                totalProducts:
                    data.totalProducts ?? 0,

                totalOrders:
                    data.totalOrders ?? 0,

                totalReviews:
                    data.totalReviews ?? 0

            });

        } catch (error) {

            console.error(
                "Admin summary error:",
                error
            );


            setError(
                "Cannot connect to the backend. Make sure Spring Boot is running."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem(
            "loggedInUser"
        );

        navigate("/");

    };


    // =====================================================
    // IF USER DOES NOT EXIST
    // =====================================================

    if (!loggedInUser) {

        return null;

    }


    // =====================================================
    // DASHBOARD UI
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dashboard-header">


                {/* BRAND */}

                <div className="brand">

                    <div className="brand-icon">
                        🛒
                    </div>


                    <div>

                        <div className="brand-name">
                            ShaliniMart
                        </div>

                        <div className="brand-subtitle">
                            Smart Shopping • Easy Management
                        </div>

                    </div>

                </div>


                {/* HEADER RIGHT */}

                <div className="header-right">


                    <div className="user-info">

                        👑{" "}

                        {loggedInUser.username ||
                            "Admin"}

                    </div>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>



            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="dashboard-content">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <div className="welcome-card">

                    <h1>
                        Welcome,{" "}
                        {loggedInUser.username ||
                            "Admin"}{" "}
                        👋
                    </h1>


                    <p>
                        Manage your ShaliniMart
                        application from one place.
                    </p>

                </div>



                {/* =================================================
                    DASHBOARD TITLE
                ================================================= */}

                <h2 className="section-title">

                    📊 Dashboard Overview

                </h2>



                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="stats-grid">


                    {/* USERS */}

                    <div
                        className="stat-card"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon">
                            👥
                        </div>


                        <div className="stat-title">
                            Total Users
                        </div>


                        <div className="stat-number">

                            {loading
                                ? "..."
                                : summary.totalUsers}

                        </div>

                    </div>



                    {/* PRODUCTS */}

                    <div
                        className="stat-card"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon">
                            🛍️
                        </div>


                        <div className="stat-title">
                            Total Products
                        </div>


                        <div className="stat-number">

                            {loading
                                ? "..."
                                : summary.totalProducts}

                        </div>

                    </div>



                    {/* ORDERS */}

                    <div
                        className="stat-card"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon">
                            📦
                        </div>


                        <div className="stat-title">
                            Total Orders
                        </div>


                        <div className="stat-number">

                            {loading
                                ? "..."
                                : summary.totalOrders}

                        </div>

                    </div>



                    {/* REVIEWS */}

                    <div
                        className="stat-card"
                        onClick={() =>
                            navigate("/admin/reviews")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="stat-icon">
                            ⭐
                        </div>


                        <div className="stat-title">
                            Total Reviews
                        </div>


                        <div className="stat-number">

                            {loading
                                ? "..."
                                : summary.totalReviews}

                        </div>

                    </div>

                </div>



                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div
                        style={{
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            padding: "15px",
                            borderRadius: "10px",
                            marginTop: "25px",
                            fontWeight: "bold"
                        }}
                    >

                        ⚠️ {error}

                        <br />

                        <button
                            onClick={loadSummary}
                            style={{
                                marginTop: "10px",
                                padding: "8px 15px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            Try Again
                        </button>

                    </div>

                )}



                {/* =================================================
                    MANAGEMENT
                ================================================= */}

                <h2
                    className="section-title"
                    style={{
                        marginTop: "40px"
                    }}
                >

                    ⚙️ Admin Management

                </h2>



                <p
                    style={{
                        color: "#64748b",
                        marginBottom: "20px"
                    }}
                >

                    Select an option to manage your
                    ShaliniMart application.

                </p>



                {/* =================================================
                    MANAGEMENT CARDS
                ================================================= */}

                <div className="action-grid">


                    {/* =================================================
                        USERS
                    ================================================= */}

                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                    >

                        <div className="action-icon">
                            👥
                        </div>


                        <h3>
                            Manage Users
                        </h3>


                        <p>
                            View and manage registered
                            customers and sellers.
                        </p>

                    </button>



                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >

                        <div className="action-icon">
                            🛍️
                        </div>


                        <h3>
                            Manage Products
                        </h3>


                        <p>
                            View and manage products
                            available in ShaliniMart.
                        </p>

                    </button>



                    {/* =================================================
                        ORDERS
                    ================================================= */}

                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >

                        <div className="action-icon">
                            📦
                        </div>


                        <h3>
                            Manage Orders
                        </h3>


                        <p>
                            View customer orders and
                            order information.
                        </p>

                    </button>



                    {/* =================================================
                        REVIEWS
                    ================================================= */}

                    <button
                        className="action-card"
                        onClick={() =>
                            navigate("/admin/reviews")
                        }
                    >

                        <div className="action-icon">
                            ⭐
                        </div>


                        <h3>
                            Manage Reviews
                        </h3>


                        <p>
                            View customer reviews and
                            remove inappropriate reviews.
                        </p>

                    </button>

                </div>



                {/* =================================================
                    ADMIN INFORMATION
                ================================================= */}

                <div
                    style={{
                        marginTop: "40px",
                        background:
                            "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                        padding: "25px",
                        borderRadius: "18px",
                        border:
                            "1px solid #e0e7ff"
                    }}
                >

                    <h3
                        style={{
                            marginTop: 0,
                            color: "#312e81"
                        }}
                    >
                        👑 Administrator Access
                    </h3>


                    <p
                        style={{
                            color: "#475569",
                            lineHeight: "1.6"
                        }}
                    >

                        As the administrator, you can
                        monitor users, products, orders
                        and reviews across the
                        ShaliniMart application.

                    </p>

                </div>

            </main>

        </div>

    );

}


export default AdminDashboard;