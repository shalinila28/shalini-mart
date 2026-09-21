import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");

        if (!email || !password) {
            setMessage("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "https://shalini-mart-production.up.railway.app/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const rawText = await response.text();

            let data = null;

            try {
                data = JSON.parse(rawText);
            } catch {
                data = null;
            }

            if (!response.ok) {

                setMessage(
                    (data && data.message)
                    || rawText
                    || "Invalid email or password."
                );

                return;
            }

            // Backend should return user object
            if (!data || typeof data !== "object") {

                setMessage(
                    rawText || "Invalid email or password."
                );

                return;
            }

            if (data.error) {

                setMessage(
                    data.message || data.error
                );

                return;
            }

            // ==========================================
            // IMPORTANT FIX
            // Normalize role BEFORE storing user
            // ==========================================

            const normalizedRole =
                data.role
                    ? String(data.role).trim().toUpperCase()
                    : "";

            if (
                normalizedRole !== "CUSTOMER" &&
                normalizedRole !== "SELLER" &&
                normalizedRole !== "ADMIN"
            ) {

                setMessage("Invalid user role.");

                return;
            }

            // Create clean user object
            const loggedInUser = {

                id: data.id,

                username: data.username,

                email: data.email,

                role: normalizedRole
            };

            // ==========================================
            // SAVE CORRECT ROLE IN LOCAL STORAGE
            // ==========================================

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(loggedInUser)
            );

            console.log(
                "Logged in user:",
                loggedInUser
            );

            // ==========================================
            // ROLE BASED NAVIGATION
            // ==========================================

            if (normalizedRole === "CUSTOMER") {

                navigate("/customer-dashboard");

            }
            else if (normalizedRole === "SELLER") {

                navigate("/seller-dashboard");

            }
            else if (normalizedRole === "ADMIN") {

                navigate("/admin-dashboard");

            }

        }
        catch (error) {

            console.error(
                "Login request failed:",
                error
            );

            setMessage(
                "Cannot connect to backend."
            );

        }
        finally {

            setLoading(false);
        }
    };


    return (

        <div style={styles.page}>

            {/* LEFT SIDE */}

            <div style={styles.left}>

                <div style={styles.brandIcon}>
                    🛒
                </div>

                <h1 style={styles.brand}>
                    ShaliniMart
                </h1>

                <h2 style={styles.welcome}>
                    Welcome Back! 👋
                </h2>

                <p style={styles.description}>
                    Login to continue your shopping journey
                    and manage your orders, cart and account.
                </p>

                <div style={styles.feature}>
                    <span style={styles.featureIcon}>
                        🛍️
                    </span>

                    <div>
                        <strong>Easy Shopping</strong>
                        <small>Find products you love</small>
                    </div>
                </div>

                <div style={styles.feature}>
                    <span style={styles.featureIcon}>
                        📦
                    </span>

                    <div>
                        <strong>Track Orders</strong>
                        <small>Keep track of your purchases</small>
                    </div>
                </div>

                <div style={styles.feature}>
                    <span style={styles.featureIcon}>
                        🔐
                    </span>

                    <div>
                        <strong>Secure Account</strong>
                        <small>Your account stays protected</small>
                    </div>
                </div>

            </div>


            {/* RIGHT SIDE */}

            <div style={styles.right}>

                <div style={styles.loginCard}>

                    <div style={styles.lock}>
                        🔐
                    </div>

                    <h1 style={styles.title}>
                        Login
                    </h1>

                    <p style={styles.subtitle}>
                        Sign in to your ShaliniMart account
                    </p>


                    <form onSubmit={handleLogin}>

                        <label style={styles.label}>
                            Email Address
                        </label>

                        <div style={styles.inputBox}>

                            <span style={styles.icon}>
                                📧
                            </span>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                style={styles.input}
                            />

                        </div>


                        <label style={styles.label}>
                            Password
                        </label>

                        <div style={styles.inputBox}>

                            <span style={styles.icon}>
                                🔑
                            </span>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                style={styles.input}
                            />

                        </div>


                        {message && (

                            <div style={styles.message}>
                                {message}
                            </div>

                        )}


                        <button
                            type="submit"
                            style={styles.loginButton}
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login →"}

                        </button>

                    </form>


                    <p style={styles.registerText}>

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            style={styles.registerLink}
                        >
                            Create Account
                        </Link>

                    </p>


                    <p style={styles.secure}>
                        🔒 Secure ShaliniMart Login
                    </p>

                </div>

            </div>

        </div>
    );
}


const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        background: "#f8fafc"
    },

    left: {
        width: "50%",
        boxSizing: "border-box",
        padding: "70px 60px",
        background:
            "linear-gradient(145deg, #071a52, #0b4fbd, #1685e5)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },

    brandIcon: {
        width: "70px",
        height: "70px",
        background: "white",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "38px",
        marginBottom: "20px"
    },

    brand: {
        fontSize: "48px",
        margin: "0 0 40px",
        fontWeight: "800"
    },

    welcome: {
        fontSize: "34px",
        margin: "0 0 15px"
    },

    description: {
        fontSize: "18px",
        lineHeight: "1.7",
        maxWidth: "600px",
        marginBottom: "35px"
    },

    feature: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        padding: "18px 22px",
        marginBottom: "15px",
        borderRadius: "15px",
        background: "rgba(255,255,255,0.12)"
    },

    featureIcon: {
        fontSize: "30px"
    },

    right: {
        width: "50%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        boxSizing: "border-box",
        background: "#f8fafc"
    },

    loginCard: {
        width: "100%",
        maxWidth: "500px",
        padding: "45px",
        boxSizing: "border-box",
        background: "white",
        borderRadius: "25px",
        boxShadow:
            "0 20px 50px rgba(15,23,42,0.15)"
    },

    lock: {
        width: "65px",
        height: "65px",
        borderRadius: "18px",
        background: "#e0efff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        marginBottom: "20px"
    },

    title: {
        margin: "0",
        color: "#071a52",
        fontSize: "38px"
    },

    subtitle: {
        color: "#64748b",
        fontSize: "17px",
        marginBottom: "35px"
    },

    label: {
        display: "block",
        color: "#172033",
        fontSize: "15px",
        fontWeight: "700",
        marginBottom: "8px",
        marginTop: "20px"
    },

    inputBox: {
        width: "100%",
        height: "55px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        border: "2px solid #dbe4ef",
        borderRadius: "12px",
        background: "#f8fafc",
        overflow: "hidden"
    },

    icon: {
        width: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        flexShrink: 0
    },

    input: {
        flex: 1,
        height: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "#172033",
        fontSize: "16px",
        padding: "0 15px 0 5px",
        boxSizing: "border-box"
    },

    message: {
        marginTop: "18px",
        padding: "12px",
        borderRadius: "10px",
        background: "#fee2e2",
        color: "#991b1b",
        fontWeight: "600",
        textAlign: "center"
    },

    loginButton: {
        width: "100%",
        marginTop: "25px",
        height: "55px",
        border: "none",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg, #087ee8, #1557d6)",
        color: "white",
        fontSize: "17px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow:
            "0 8px 20px rgba(21,87,214,0.3)"
    },

    registerText: {
        textAlign: "center",
        color: "#64748b",
        marginTop: "25px"
    },

    registerLink: {
        color: "#1557d6",
        fontWeight: "bold",
        textDecoration: "none"
    },

    secure: {
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "13px",
        marginTop: "25px"
    }
};

export default Login;