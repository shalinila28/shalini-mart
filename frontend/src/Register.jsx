import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./config";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "CUSTOMER"
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMessage("");
    };


    // =====================================================
    // REGISTER
    // =====================================================

    const handleRegister = async (e) => {

        e.preventDefault();

        if (
            !formData.username ||
            !formData.email ||
            !formData.password
        ) {
            setMessage("⚠️ Please fill all required fields.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.text();

            if (!response.ok || !result.toLowerCase().includes("successful")) {

                setMessage(
                    "❌ " + (result || "Registration failed.")
                );

                setLoading(false);
                return;
            }

            setMessage(
                "✅ Registration successful! Redirecting..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(error);

            setMessage(
                "❌ Cannot connect to backend!"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div style={styles.page}>

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div style={styles.leftSide}>

                <div style={styles.brandIcon}>
                    🛒
                </div>

                <h1 style={styles.brand}>
                    ShaliniMart
                </h1>

                <h2 style={styles.welcome}>
                    Join Us! 🎉
                </h2>

                <p style={styles.leftText}>
                    Create your ShaliniMart account and
                    start your amazing shopping journey.
                </p>


                <div style={styles.featureCard}>

                    <div style={styles.featureIcon}>
                        🛍️
                    </div>

                    <div>
                        <h3 style={styles.featureTitle}>
                            Easy Shopping
                        </h3>

                        <p style={styles.featureText}>
                            Discover products you love
                        </p>
                    </div>

                </div>


                <div style={styles.featureCard}>

                    <div style={styles.featureIcon}>
                        📦
                    </div>

                    <div>
                        <h3 style={styles.featureTitle}>
                            Track Orders
                        </h3>

                        <p style={styles.featureText}>
                            Manage your purchases easily
                        </p>
                    </div>

                </div>


                <div style={styles.featureCard}>

                    <div style={styles.featureIcon}>
                        🔐
                    </div>

                    <div>
                        <h3 style={styles.featureTitle}>
                            Secure Account
                        </h3>

                        <p style={styles.featureText}>
                            Your account stays protected
                        </p>
                    </div>

                </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div style={styles.rightSide}>

                <div style={styles.registerCard}>

                    {/* ICON */}

                    <div style={styles.lockIcon}>
                        📝
                    </div>


                    <h1 style={styles.title}>
                        Create Account
                    </h1>

                    <p style={styles.subtitle}>
                        Join the ShaliniMart family
                    </p>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form onSubmit={handleRegister}>


                        {/* USERNAME */}

                        <label style={styles.label}>
                            Username
                        </label>

                        <div style={styles.inputContainer}>

                            <span style={styles.inputIcon}>
                                👤
                            </span>

                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                style={styles.input}
                                autoComplete="username"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <label style={styles.label}>
                            Email Address
                        </label>

                        <div style={styles.inputContainer}>

                            <span style={styles.inputIcon}>
                                ✉️
                            </span>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <label style={styles.label}>
                            Password
                        </label>

                        <div style={styles.inputContainer}>

                            <span style={styles.inputIcon}>
                                🔑
                            </span>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                style={styles.input}
                                autoComplete="new-password"
                                required
                            />

                        </div>


                        {/* ROLE */}

                        <label style={styles.label}>
                            Account Type
                        </label>

                        <div style={styles.inputContainer}>

                            <span style={styles.inputIcon}>
                                👥
                            </span>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                style={styles.select}
                            >

                                <option value="CUSTOMER">
                                    🛒 Customer
                                </option>

                                <option value="SELLER">
                                    🏪 Seller
                                </option>

                            </select>

                        </div>


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            style={{
                                ...styles.registerButton,
                                opacity: loading ? 0.7 : 1
                            }}
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account →"}

                        </button>


                    </form>


                    {/* =================================================
                        MESSAGE
                    ================================================= */}

                    {message && (

                        <div style={styles.message}>
                            {message}
                        </div>

                    )}


                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <p style={styles.loginText}>

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            style={styles.loginLink}
                        >
                            Login
                        </Link>

                    </p>


                    <p style={styles.secureText}>
                        🔒 Secure ShaliniMart Registration
                    </p>

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
        display: "flex",
        fontFamily:
            "'Segoe UI', Arial, sans-serif",
        background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)"
    },


    /* =================================================
       LEFT SIDE
    ================================================= */

    leftSide: {
        width: "50%",
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "70px 60px",
        background:
            "linear-gradient(145deg, #071a49, #123d91, #0878e8)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },


    brandIcon: {
        width: "75px",
        height: "75px",
        borderRadius: "20px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        marginBottom: "20px",
        boxShadow:
            "0 10px 25px rgba(0,0,0,0.2)"
    },


    brand: {
        fontSize: "48px",
        margin: "0 0 35px",
        fontWeight: "800",
        letterSpacing: "-1px"
    },


    welcome: {
        fontSize: "32px",
        margin: "0 0 15px"
    },


    leftText: {
        fontSize: "18px",
        lineHeight: "1.7",
        maxWidth: "560px",
        marginBottom: "35px",
        color: "#e8f1ff"
    },


    featureCard: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        padding: "17px 20px",
        marginBottom: "15px",
        maxWidth: "520px",
        borderRadius: "16px",
        background:
            "rgba(255,255,255,0.12)",
        border:
            "1px solid rgba(255,255,255,0.12)",
        boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)"
    },


    featureIcon: {
        fontSize: "28px"
    },


    featureTitle: {
        margin: "0 0 4px",
        fontSize: "17px",
        color: "white"
    },


    featureText: {
        margin: 0,
        color: "#dbeafe",
        fontSize: "14px"
    },


    /* =================================================
       RIGHT SIDE
    ================================================= */

    rightSide: {
        width: "50%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "35px",
        boxSizing: "border-box",
        background:
            "linear-gradient(135deg, #f8fafc, #e0f2fe)"
    },


    registerCard: {
        width: "100%",
        maxWidth: "520px",
        padding: "42px",
        boxSizing: "border-box",
        background:
            "rgba(255,255,255,0.95)",
        borderRadius: "28px",
        boxShadow:
            "0 20px 60px rgba(15,23,42,0.16)",
        border:
            "1px solid rgba(148,163,184,0.25)"
    },


    lockIcon: {
        width: "65px",
        height: "65px",
        borderRadius: "18px",
        background:
            "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "32px",
        marginBottom: "18px"
    },


    title: {
        margin: 0,
        fontSize: "34px",
        color: "#0f172a",
        fontWeight: "800"
    },


    subtitle: {
        marginTop: "8px",
        marginBottom: "30px",
        color: "#64748b",
        fontSize: "16px"
    },


    /* =================================================
       LABEL
    ================================================= */

    label: {
        display: "block",
        fontSize: "15px",
        fontWeight: "700",
        color: "#172033",
        marginTop: "18px",
        marginBottom: "8px"
    },


    /* =================================================
       SINGLE INPUT BOX
    ================================================= */

    inputContainer: {
        width: "100%",
        height: "54px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        border: "1px solid #dbe3ee",
        borderRadius: "13px",
        overflow: "hidden"
    },


    inputIcon: {
        width: "48px",
        minWidth: "48px",
        textAlign: "center",
        fontSize: "18px"
    },


    input: {
        flex: 1,
        height: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "16px",
        color: "#172033",
        padding: "0 15px 0 0",
        boxSizing: "border-box"
    },


    select: {
        flex: 1,
        height: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "16px",
        color: "#172033",
        paddingRight: "15px",
        cursor: "pointer"
    },


    /* =================================================
       BUTTON
    ================================================= */

    registerButton: {
        width: "100%",
        marginTop: "28px",
        padding: "16px",
        border: "none",
        borderRadius: "13px",
        background:
            "linear-gradient(135deg, #1683ed, #155bd7)",
        color: "white",
        fontSize: "17px",
        fontWeight: "800",
        cursor: "pointer",
        boxShadow:
            "0 8px 20px rgba(37,99,235,0.28)"
    },


    /* =================================================
       MESSAGE
    ================================================= */

    message: {
        marginTop: "18px",
        padding: "13px",
        borderRadius: "10px",
        backgroundColor: "#eff6ff",
        color: "#173b7a",
        textAlign: "center",
        fontWeight: "600",
        fontSize: "14px"
    },


    /* =================================================
       LOGIN LINK
    ================================================= */

    loginText: {
        textAlign: "center",
        marginTop: "25px",
        color: "#64748b",
        fontSize: "14px"
    },


    loginLink: {
        color: "#155bd7",
        fontWeight: "800",
        textDecoration: "none"
    },


    secureText: {
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "12px",
        marginTop: "22px"
    }

};


export default Register;