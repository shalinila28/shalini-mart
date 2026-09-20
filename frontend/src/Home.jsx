import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {

    const navigate = useNavigate();

    return (

        <div className="welcome-page">


            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="welcome-navbar">

                <div
                    className="welcome-logo"
                    onClick={() => navigate("/")}
                >

                    <div className="welcome-logo-icon">
                        🛒
                    </div>

                    <div>
                        <div className="welcome-logo-name">
                            ShaliniMart
                        </div>

                        <div className="welcome-logo-tagline">
                            Smart Shopping
                        </div>
                    </div>

                </div>


                <div className="welcome-nav-buttons">

                    <button
                        className="welcome-login-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>


                    <button
                        className="welcome-register-btn"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

            </nav>



            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="welcome-hero">


                {/* LEFT SIDE */}

                <div className="welcome-hero-content">

                    <div className="welcome-badge">

                        ✨ Welcome to ShaliniMart

                    </div>


                    <h1>

                        Shop Smart.

                        <br />

                        <span>
                            Shop Easy.
                        </span>

                    </h1>


                    <p>

                        Your simple and smart online
                        shopping destination. Discover
                        products, add them to your cart,
                        place orders and enjoy an easy
                        shopping experience.

                    </p>


                    {/* BUTTONS */}

                    <div className="welcome-hero-buttons">

                        <button
                            className="welcome-start-btn"
                            onClick={() =>
                                navigate("/register")
                            }
                        >

                            🛍️ Start Shopping

                        </button>


                        <button
                            className="welcome-existing-btn"
                            onClick={() =>
                                navigate("/login")
                            }
                        >

                            Already have an account?

                        </button>

                    </div>


                    {/* SMALL FEATURES */}

                    <div className="welcome-mini-features">

                        <div>

                            <span>
                                🛒
                            </span>

                            <strong>
                                Easy Shopping
                            </strong>

                        </div>


                        <div>

                            <span>
                                📦
                            </span>

                            <strong>
                                Easy Orders
                            </strong>

                        </div>


                        <div>

                            <span>
                                🔐
                            </span>

                            <strong>
                                Secure Access
                            </strong>

                        </div>

                    </div>

                </div>



                {/* RIGHT SIDE */}

                <div className="welcome-visual">


                    {/* MAIN SHOPPING CARD */}

                    <div className="shopping-card">


                        <div className="shopping-card-top">

                            <span>
                                🛍️
                            </span>

                            <span className="online-dot">
                                ● Online
                            </span>

                        </div>


                        <div className="shopping-bag">

                            🛒

                        </div>


                        <h2>
                            Your Shopping
                            <br />
                            Starts Here
                        </h2>


                        <p>
                            Find what you love.
                        </p>


                        <div className="fake-products">

                            <div>
                                🎧
                            </div>

                            <div>
                                👟
                            </div>

                            <div>
                                📱
                            </div>

                            <div>
                                💻
                            </div>

                        </div>


                    </div>


                    {/* FLOATING CARD 1 */}

                    <div className="floating-card floating-one">

                        <span>
                            ⭐
                        </span>

                        <div>

                            <strong>
                                Great Experience
                            </strong>

                            <small>
                                Simple & Easy
                            </small>

                        </div>

                    </div>


                    {/* FLOATING CARD 2 */}

                    <div className="floating-card floating-two">

                        <span>
                            📦
                        </span>

                        <div>

                            <strong>
                                Easy Orders
                            </strong>

                            <small>
                                Track your orders
                            </small>

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================================
                FEATURES SECTION
            ===================================================== */}

            <section className="welcome-features">


                <div className="welcome-section-heading">

                    <span>
                        WHY SHALINIMART?
                    </span>

                    <h2>
                        Everything you need,
                        <br />
                        in one place.
                    </h2>

                </div>



                <div className="welcome-feature-grid">


                    <div className="welcome-feature-card">

                        <div className="feature-icon blue">
                            🛍️
                        </div>

                        <h3>
                            Wide Product Choice
                        </h3>

                        <p>
                            Explore products from
                            different categories and
                            choose what you need.
                        </p>

                    </div>



                    <div className="welcome-feature-card">

                        <div className="feature-icon purple">
                            🛒
                        </div>

                        <h3>
                            Simple Cart
                        </h3>

                        <p>
                            Add products to your cart,
                            update quantities and manage
                            your shopping easily.
                        </p>

                    </div>



                    <div className="welcome-feature-card">

                        <div className="feature-icon green">
                            📦
                        </div>

                        <h3>
                            Order Tracking
                        </h3>

                        <p>
                            Place your order and view
                            your order history whenever
                            you need.
                        </p>

                    </div>



                    <div className="welcome-feature-card">

                        <div className="feature-icon orange">
                            ⭐
                        </div>

                        <h3>
                            Reviews
                        </h3>

                        <p>
                            Share your experience by
                            rating and reviewing products
                            you received.
                        </p>

                    </div>

                </div>

            </section>



            {/* =====================================================
                CALL TO ACTION
            ===================================================== */}

            <section className="welcome-cta">

                <div>

                    <h2>
                        Ready to start shopping? 🛒
                    </h2>

                    <p>
                        Create your ShaliniMart account
                        and begin your shopping journey.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/register")
                    }
                >
                    Create Your Account →
                </button>

            </section>



            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="welcome-footer">

                <div>

                    🛒 <strong>
                        ShaliniMart
                    </strong>

                </div>


                <p>
                    © 2026 ShaliniMart. Smart Shopping,
                    Simple Experience.
                </p>

            </footer>

        </div>

    );
}

export default Home;