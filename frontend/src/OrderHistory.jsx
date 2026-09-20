import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderHistory() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const customerId = loggedInUser?.id;


    // =====================================================
    // LOAD CUSTOMER ORDERS
    // =====================================================

    useEffect(() => {

        if (!loggedInUser) {

            navigate("/login");

            return;
        }

        if (loggedInUser.role !== "CUSTOMER") {

            navigate("/");

            return;
        }

        loadOrders();

    }, []);


    // =====================================================
    // GET ORDERS
    // =====================================================

    const loadOrders = async () => {

        if (!customerId) {

            setMessage("Customer information not found.");

            setLoading(false);

            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/orders/customer/${customerId}`
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load orders"
                );
            }


            const data = await response.json();


            console.log(
                "Orders received from backend:",
                data
            );


            setOrders(data);

        } catch (error) {

            console.error(
                "Error loading orders:",
                error
            );

            setMessage(
                "Cannot connect to backend."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // MARK ORDER AS RECEIVED
    // =====================================================

    const markReceived = async (orderId) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/orders/${orderId}/received?customerId=${customerId}`,
                {
                    method: "PUT"
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result ||
                    "Unable to update order."
                );

                return;
            }


            alert(
                "Order marked as RECEIVED!"
            );


            // Reload orders

            loadOrders();

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend."
            );
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
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <h2>
                    📦 Loading your orders...
                </h2>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div style={styles.page}>


            {/* =================================================
                HEADER
            ================================================= */}

            <div style={styles.header}>

                <div>

                    <h1 style={styles.logo}>
                        🛒 ShaliniMart
                    </h1>

                    <h2 style={styles.title}>
                        📦 My Orders
                    </h2>

                    <p style={styles.welcome}>
                        Welcome,{" "}
                        <strong>
                            {loggedInUser?.username}
                        </strong>
                    </p>

                </div>


                <div style={styles.headerButtons}>

                    <button
                        style={styles.backButton}
                        onClick={() =>
                            navigate(
                                "/customer-dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        style={styles.logoutButton}
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>



            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {message && (

                <div style={styles.errorBox}>
                    {message}
                </div>

            )}



            {/* =================================================
                NO ORDERS
            ================================================= */}

            {!message && orders.length === 0 && (

                <div style={styles.emptyBox}>

                    <div style={styles.emptyIcon}>
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <button
                        style={styles.shopButton}
                        onClick={() =>
                            navigate(
                                "/customer-dashboard"
                            )
                        }
                    >
                        🛍️ Start Shopping
                    </button>

                </div>

            )}



            {/* =================================================
                ORDERS
            ================================================= */}

            <div style={styles.ordersContainer}>

                {orders.map((order) => {


                    /*
                     * IMPORTANT:
                     * Your backend Order object should
                     * contain totalAmount.
                     *
                     * These fallbacks also support
                     * total / amount if your entity
                     * uses a different field name.
                     */

                    const totalAmount =
                        order.totalAmount ??
                        order.total ??
                        order.amount ??
                        0;


                    const status =
                        order.status ||
                        "CONFIRMED";


                    return (

                        <div
                            key={order.id}
                            style={styles.orderCard}
                        >


                            {/* =================================================
                                ORDER HEADER
                            ================================================= */}

                            <div
                                style={
                                    styles.orderHeader
                                }
                            >

                                <div>

                                    <h2
                                        style={
                                            styles.orderTitle
                                        }
                                    >
                                        Order #{order.id}
                                    </h2>

                                    <p
                                        style={
                                            styles.orderDate
                                        }
                                    >
                                        Customer ID:{" "}
                                        {order.customerId}
                                    </p>

                                </div>


                                <div
                                    style={
                                        status === "RECEIVED"
                                            ? styles.receivedBadge
                                            : styles.confirmedBadge
                                    }
                                >

                                    {status === "RECEIVED"
                                        ? "✓ RECEIVED"
                                        : "📦 CONFIRMED"}

                                </div>

                            </div>



                            {/* =================================================
                                TOTAL AMOUNT
                            ================================================= */}

                            <div
                                style={
                                    styles.totalBox
                                }
                            >

                                <div>

                                    <span
                                        style={
                                            styles.totalLabel
                                        }
                                    >
                                        💰 Total Amount
                                    </span>

                                    <h2
                                        style={
                                            styles.totalAmount
                                        }
                                    >
                                        ₹
                                        {Number(
                                            totalAmount
                                        ).toFixed(2)}
                                    </h2>

                                </div>


                                <div
                                    style={
                                        styles.paymentStatus
                                    }
                                >
                                    ✓ Payment Confirmed
                                </div>

                            </div>



                            {/* =================================================
                                ORDER DETAILS
                            ================================================= */}

                            <div
                                style={
                                    styles.detailsGrid
                                }
                            >

                                <div
                                    style={
                                        styles.detailBox
                                    }
                                >

                                    <span>
                                        Order ID
                                    </span>

                                    <strong>
                                        #{order.id}
                                    </strong>

                                </div>


                                <div
                                    style={
                                        styles.detailBox
                                    }
                                >

                                    <span>
                                        Customer ID
                                    </span>

                                    <strong>
                                        {order.customerId}
                                    </strong>

                                </div>


                                <div
                                    style={
                                        styles.detailBox
                                    }
                                >

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {status}
                                    </strong>

                                </div>

                            </div>



                            {/* =================================================
                                RECEIVED BUTTON
                            ================================================= */}

                            {status === "CONFIRMED" && (

                                <div
                                    style={
                                        styles.receivedSection
                                    }
                                >

                                    <p>
                                        Have you received this
                                        order?
                                    </p>


                                    <button
                                        style={
                                            styles.receivedButton
                                        }
                                        onClick={() =>
                                            markReceived(
                                                order.id
                                            )
                                        }
                                    >
                                        ✓ Mark as Received
                                    </button>

                                </div>

                            )}


                            {status === "RECEIVED" && (

                                <div
                                    style={
                                        styles.receivedMessage
                                    }
                                >

                                    ✓ You have received
                                    this order.

                                </div>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

    page: {

        minHeight: "100vh",

        background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",

        padding: "30px",

        fontFamily: "Arial, sans-serif",

        color: "#111827"

    },


    loadingPage: {

        minHeight: "100vh",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background: "#f1f5f9",

        color: "#1e1b4b",

        fontFamily: "Arial"

    },


    header: {

        maxWidth: "1100px",

        margin: "0 auto 30px",

        padding: "25px",

        borderRadius: "18px",

        background:
            "linear-gradient(135deg, #0f172a, #312e81, #2563eb)",

        color: "white",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        gap: "20px",

        boxShadow:
            "0 15px 40px rgba(15,23,42,0.20)"

    },


    logo: {

        margin: "0 0 8px",

        color: "white",

        fontSize: "28px"

    },


    title: {

        margin: "0",

        color: "white",

        fontSize: "30px"

    },


    welcome: {

        color: "#dbeafe",

        marginBottom: "0"

    },


    headerButtons: {

        display: "flex",

        gap: "10px",

        flexWrap: "wrap"

    },


    backButton: {

        border: "none",

        padding: "12px 18px",

        borderRadius: "9px",

        background: "white",

        color: "#312e81",

        fontWeight: "800",

        cursor: "pointer"

    },


    logoutButton: {

        border: "none",

        padding: "12px 18px",

        borderRadius: "9px",

        background: "#ef4444",

        color: "white",

        fontWeight: "800",

        cursor: "pointer"

    },


    errorBox: {

        maxWidth: "1100px",

        margin: "0 auto 20px",

        padding: "16px",

        borderRadius: "10px",

        background: "#fee2e2",

        color: "#991b1b",

        fontWeight: "700",

        textAlign: "center"

    },


    emptyBox: {

        maxWidth: "600px",

        margin: "80px auto",

        padding: "50px 30px",

        textAlign: "center",

        background: "white",

        borderRadius: "20px",

        boxShadow:
            "0 10px 35px rgba(15,23,42,0.10)"

    },


    emptyIcon: {

        fontSize: "65px"

    },


    shopButton: {

        marginTop: "15px",

        padding: "13px 22px",

        border: "none",

        borderRadius: "10px",

        background:
            "linear-gradient(135deg, #4f46e5, #2563eb)",

        color: "white",

        fontWeight: "800",

        cursor: "pointer"

    },


    ordersContainer: {

        maxWidth: "1100px",

        margin: "0 auto"

    },


    orderCard: {

        background: "white",

        borderRadius: "18px",

        padding: "25px",

        marginBottom: "25px",

        boxShadow:
            "0 10px 35px rgba(15,23,42,0.10)",

        border: "1px solid #e2e8f0"

    },


    orderHeader: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        gap: "15px",

        paddingBottom: "18px",

        borderBottom: "1px solid #e2e8f0"

    },


    orderTitle: {

        color: "#111827",

        margin: "0 0 6px",

        fontSize: "23px"

    },


    orderDate: {

        color: "#64748b",

        margin: "0"

    },


    confirmedBadge: {

        padding: "9px 14px",

        borderRadius: "20px",

        background: "#dbeafe",

        color: "#1d4ed8",

        fontWeight: "900",

        fontSize: "13px"

    },


    receivedBadge: {

        padding: "9px 14px",

        borderRadius: "20px",

        background: "#dcfce7",

        color: "#166534",

        fontWeight: "900",

        fontSize: "13px"

    },


    totalBox: {

        marginTop: "20px",

        padding: "20px",

        borderRadius: "15px",

        background:
            "linear-gradient(135deg, #eef2ff, #eff6ff)",

        border: "1px solid #c7d2fe",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        gap: "15px"

    },


    totalLabel: {

        display: "block",

        color: "#475569",

        fontSize: "14px",

        fontWeight: "700"

    },


    totalAmount: {

        color: "#312e81",

        margin: "5px 0 0",

        fontSize: "30px",

        fontWeight: "900"

    },


    paymentStatus: {

        padding: "9px 13px",

        borderRadius: "20px",

        background: "#dcfce7",

        color: "#166534",

        fontWeight: "800",

        fontSize: "12px"

    },


    detailsGrid: {

        display: "grid",

        gridTemplateColumns:
            "repeat(3, 1fr)",

        gap: "15px",

        marginTop: "20px"

    },


    detailBox: {

        padding: "15px",

        borderRadius: "10px",

        background: "#f8fafc",

        border: "1px solid #e2e8f0"

    },


    receivedSection: {

        marginTop: "20px",

        paddingTop: "20px",

        borderTop: "1px solid #e2e8f0",

        textAlign: "right"

    },


    receivedSectionp: {

        color: "#475569"

    },


    receivedButton: {

        border: "none",

        padding: "12px 20px",

        borderRadius: "10px",

        background:
            "linear-gradient(135deg, #16a34a, #15803d)",

        color: "white",

        fontWeight: "900",

        cursor: "pointer"

    },


    receivedMessage: {

        marginTop: "20px",

        padding: "14px",

        borderRadius: "10px",

        background: "#dcfce7",

        color: "#166534",

        fontWeight: "800",

        textAlign: "center"

    }

};


export default OrderHistory;