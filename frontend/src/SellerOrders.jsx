import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerOrders() {

    const navigate = useNavigate();

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const sellerId = loggedInUser?.id;


    const [orders, setOrders] = useState([]);

    const [message, setMessage] = useState("");


    // ==============================
    // LOAD ORDERS
    // ==============================

    const loadOrders = async () => {

        if (!sellerId) {
            return;
        }


        try {

            const response = await fetch(
                `https://shalini-mart-production.up.railway.app/api/orders/seller/${sellerId}`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to load orders"
                );
            }


            const data =
                await response.json();


            setOrders(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load incoming orders."
            );
        }
    };


    useEffect(() => {

        loadOrders();

    }, [sellerId]);


    // ==============================
    // SECURITY
    // ==============================

    if (!loggedInUser) {

        return (
            <div style={styles.center}>

                <h2>
                    Please login first.
                </h2>

                <button
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Login
                </button>

            </div>
        );
    }


    if (loggedInUser.role !== "SELLER") {

        return (
            <div style={styles.center}>

                <h2>
                    Access Denied!
                </h2>

                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Go Home
                </button>

            </div>
        );
    }


    return (

        <div style={styles.container}>

            <button
                style={styles.backButton}
                onClick={() =>
                    navigate("/seller-dashboard")
                }
            >
                ← Seller Dashboard
            </button>


            <h1>
                🚚 Incoming Orders
            </h1>


            <p>
                Orders received for your products.
            </p>


            {message && (

                <p style={styles.message}>
                    {message}
                </p>

            )}


            {orders.length === 0 ? (

                <div style={styles.empty}>

                    <h2>
                        No incoming orders yet.
                    </h2>

                    <p>
                        Customer orders for your
                        products will appear here.
                    </p>

                </div>

            ) : (

                orders.map((order, index) => (

                    <div
                        key={
                            order.orderId ||
                            index
                        }
                        style={styles.orderCard}
                    >

                        <h2>
                            Order #{order.orderId}
                        </h2>


                        <p>
                            <strong>
                                Customer ID:
                            </strong>{" "}
                            {order.customerId}
                        </p>


                        <p>
                            <strong>
                                Product:
                            </strong>{" "}
                            {order.productName}
                        </p>


                        <p>
                            <strong>
                                Quantity:
                            </strong>{" "}
                            {order.quantity}
                        </p>


                        <p>
                            <strong>
                                Price:
                            </strong>{" "}
                            ₹{order.price}
                        </p>


                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {order.status}
                        </p>

                    </div>

                ))

            )}

        </div>
    );
}


const styles = {

    container: {
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "30px",
        fontFamily: "Arial"
    },

    orderCard: {
        backgroundColor: "white",
        padding: "20px",
        marginTop: "15px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    empty: {
        backgroundColor: "white",
        padding: "30px",
        marginTop: "25px",
        borderRadius: "10px",
        textAlign: "center"
    },

    backButton: {
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer"
    },

    message: {
        fontWeight: "bold"
    },

    center: {
        textAlign: "center",
        padding: "50px"
    }

};

export default SellerOrders;