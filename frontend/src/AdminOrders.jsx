import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function AdminOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");


    // =====================================================
    // CHECK ADMIN
    // =====================================================

    useEffect(() => {

        const savedUser =
            localStorage.getItem("loggedInUser");

        if (!savedUser) {
            navigate("/login");
            return;
        }

        try {

            const user =
                JSON.parse(savedUser);

            if (
                !user.role ||
                user.role.toUpperCase() !== "ADMIN"
            ) {
                navigate("/");
                return;
            }

            loadOrders();

        } catch (error) {

            localStorage.removeItem(
                "loggedInUser"
            );

            navigate("/login");
        }

    }, [navigate]);


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    const loadOrders = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/admin/orders`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load orders"
                );
            }

            const data =
                await response.json();

            setOrders(data);
            setMessage("");

        } catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend!"
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div style={styles.container}>

            {/* HEADER */}

            <div style={styles.header}>

                <div>

                    <h1>
                        🛒 ShaliniMart
                    </h1>

                    <h2>
                        📦 Manage Orders
                    </h2>

                </div>


                <button
                    style={styles.backButton}
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* MESSAGE */}

            {message && (

                <div style={styles.message}>
                    {message}
                </div>

            )}


            {/* ORDERS */}

            {loading ? (

                <h2>
                    Loading orders...
                </h2>

            ) : orders.length === 0 ? (

                <h2>
                    No orders found.
                </h2>

            ) : (

                <>

                    <h2>
                        All Customer Orders
                    </h2>


                    {orders.map((order) => (

                        <div
                            key={order.id}
                            style={styles.orderCard}
                        >

                            <h2>
                                📦 Order #{order.id}
                            </h2>

                            <p>
                                <strong>
                                    Customer ID:
                                </strong>{" "}
                                {order.customerId}
                            </p>

                            <p>
                                <strong>
                                    Total Amount:
                                </strong>{" "}
                                ₹{order.totalAmount}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}

                                <span
                                    style={
                                        styles.status
                                    }
                                >
                                    {order.status}
                                </span>

                            </p>

                            {order.createdAt && (

                                <p>
                                    <strong>
                                        Order Date:
                                    </strong>{" "}
                                    {String(
                                        order.createdAt
                                    )}
                                </p>

                            )}

                        </div>

                    ))}

                </>

            )}

        </div>
    );
}


const styles = {

    container: {
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial"
    },

    header: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    backButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "12px 18px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    message: {
        backgroundColor: "#ffe5e5",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    orderCard: {
        backgroundColor: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    status: {
        backgroundColor: "#e8f5e9",
        padding: "5px 10px",
        borderRadius: "5px",
        fontWeight: "bold"
    }

};

export default AdminOrders;