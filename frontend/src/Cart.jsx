import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {

    const navigate = useNavigate();

    // =========================
    // LOGGED-IN USER
    // =========================

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const customerId = loggedInUser?.id;


    // =========================
    // STATES
    // =========================

    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {

        fetch("https://shalini-mart-production.up.railway.app/api/products")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load products");
                }

                return response.json();

            })
            .then(data => {

                setProducts(data);

            })
            .catch(error => {

                console.error(error);

            });

    }, []);


    // =========================
    // LOAD CART
    // =========================

    useEffect(() => {

        if (!customerId) {
            setLoading(false);
            return;
        }

        loadCart();

    }, [customerId]);


    const loadCart = () => {

        fetch(
            `https://shalini-mart-production.up.railway.app/api/cart/${customerId}`
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load cart");
                }

                return response.json();

            })
            .then(data => {

                setCart(data);
                setLoading(false);

            })
            .catch(error => {

                console.error(error);
                setLoading(false);

            });

    };


    // =========================
    // UPDATE QUANTITY
    // =========================

    const updateQuantity = (
        cartItem,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }

        fetch(
            `https://shalini-mart-production.up.railway.app/api/cart/${cartItem.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    quantity: newQuantity
                })
            }
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to update cart"
                    );
                }

                return response.json();

            })
            .then(() => {

                loadCart();

            })
            .catch(error => {

                console.error(error);

                alert(
                    "Cannot update cart."
                );

            });

    };


    // =========================
    // REMOVE ITEM
    // =========================

    const removeFromCart = (id) => {

        const confirmRemove =
            window.confirm(
                "Remove this product from cart?"
            );

        if (!confirmRemove) {
            return;
        }

        fetch(
            `https://shalini-mart-production.up.railway.app/api/cart/${id}`,
            {
                method: "DELETE"
            }
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to remove item"
                    );
                }

                return response.text();

            })
            .then(() => {

                loadCart();

            })
            .catch(error => {

                console.error(error);

                alert(
                    "Cannot remove product."
                );

            });

    };


    // =========================
    // TOTAL
    // =========================

    const getTotal = () => {

        return cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );

    };


    // =========================
    // CHECKOUT
    // =========================

    const checkout = () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }

        const total = getTotal();

        const confirmPayment =
            window.confirm(
                `Confirm mock payment of ₹${total.toFixed(2)}?`
            );

        if (!confirmPayment) {
            return;
        }

        fetch(
            `https://shalini-mart-production.up.railway.app/api/orders/checkout/${customerId}`,
            {
                method: "POST"
            }
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Checkout failed"
                    );
                }

                return response.text();

            })
            .then(data => {

                alert(data);

                loadCart();

            })
            .catch(error => {

                console.error(error);

                alert(
                    "Cannot connect to backend."
                );

            });

    };


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem(
            "loggedInUser"
        );

        navigate("/");

    };


    // =========================
    // LOGIN CHECK
    // =========================

    if (!loggedInUser) {

        return (

            <div style={styles.center}>

                <h2>
                    Please login first.
                </h2>

                <button
                    style={styles.button}
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Go to Login
                </button>

            </div>

        );

    }


    if (loggedInUser.role !== "CUSTOMER") {

        return (

            <div style={styles.center}>

                <h2>
                    Access Denied
                </h2>

                <button
                    style={styles.button}
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        );

    }


    // =========================
    // UI
    // =========================

    return (

        <div style={styles.container}>

            {/* HEADER */}

            <div style={styles.header}>

                <div>

                    <h1>
                        🛒 ShaliniMart
                    </h1>

                    <p>
                        My Cart
                    </p>

                </div>


                <div>

                    <button
                        style={styles.navButton}
                        onClick={() =>
                            navigate(
                                "/customer-dashboard"
                            )
                        }
                    >
                        🏠 Products
                    </button>


                    <button
                        style={styles.orderButton}
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        📦 My Orders
                    </button>


                    <button
                        style={styles.logoutButton}
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* TITLE */}

            <h2>
                🛒 My Shopping Cart
            </h2>


            {/* LOADING */}

            {loading && (

                <p>
                    Loading cart...
                </p>

            )}


            {/* EMPTY CART */}

            {!loading &&
            cart.length === 0 && (

                <div style={styles.emptyCart}>

                    <h2>
                        🛒 Your cart is empty
                    </h2>

                    <p>
                        Add some products to your cart.
                    </p>

                    <button
                        style={styles.button}
                        onClick={() =>
                            navigate(
                                "/customer-dashboard"
                            )
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            )}


            {/* CART ITEMS */}

            {!loading &&
            cart.length > 0 && (

                <div>

                    {cart.map(item => {

                        const product =
                            products.find(
                                p =>
                                    p.id ===
                                    item.productId
                            );


                        const itemTotal =
                            Number(item.price) *
                            Number(item.quantity);


                        return (

                            <div
                                key={item.id}
                                style={
                                    styles.cartItem
                                }
                            >

                                <div
                                    style={
                                        styles.productInfo
                                    }
                                >

                                    {product?.imageUrl && (

                                        <img
                                            src={
                                                product.imageUrl
                                            }
                                            alt={
                                                product.name
                                            }
                                            style={
                                                styles.productImage
                                            }
                                            onError={(e) => {
                                                e.target.style.display =
                                                    "none";
                                            }}
                                        />

                                    )}


                                    <div>

                                        <h3>

                                            {
                                                product
                                                    ? product.name
                                                    : `Product ID: ${item.productId}`
                                            }

                                        </h3>


                                        <p>
                                            Price:
                                            ₹{item.price}
                                        </p>


                                        <p>
                                            Quantity:
                                            {item.quantity}
                                        </p>


                                        <p>
                                            <b>
                                                Item Total:
                                            </b>{" "}
                                            ₹
                                            {itemTotal.toFixed(
                                                2
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* QUANTITY */}

                                <div
                                    style={
                                        styles.actions
                                    }
                                >

                                    <div>

                                        <button
                                            style={
                                                styles.smallButton
                                            }
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity -
                                                        1
                                                )
                                            }
                                        >
                                            −
                                        </button>


                                        <b
                                            style={{
                                                margin:
                                                    "0 15px"
                                            }}
                                        >
                                            {
                                                item.quantity
                                            }
                                        </b>


                                        <button
                                            style={
                                                styles.smallButton
                                            }
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity +
                                                        1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>


                                    <button
                                        style={
                                            styles.deleteButton
                                        }
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        );

                    })}


                    {/* TOTAL */}

                    <div
                        style={
                            styles.totalBox
                        }
                    >

                        <h2>
                            Total: ₹
                            {getTotal().toFixed(2)}
                        </h2>


                        <button
                            style={
                                styles.checkoutButton
                            }
                            onClick={checkout}
                        >
                            💳 Checkout
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

    container: {
        padding: "30px",
        fontFamily:
            "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh"
    },


    header: {
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "25px",
        flexWrap: "wrap",
        gap: "15px"
    },


    navButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "5px"
    },


    orderButton: {
        backgroundColor: "#6f42c1",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "5px"
    },


    logoutButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "5px"
    },


    center: {
        textAlign: "center",
        padding: "50px"
    },


    button: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "5px",
        cursor: "pointer"
    },


    emptyCart: {
        backgroundColor: "white",
        padding: "40px",
        textAlign: "center",
        borderRadius: "10px"
    },


    cartItem: {
        backgroundColor: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },


    productInfo: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },


    productImage: {
        width: "120px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "8px"
    },


    actions: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap"
    },


    smallButton: {
        padding: "7px 13px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "white",
        fontSize: "16px"
    },


    deleteButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: "#dc3545",
        color: "white"
    },


    totalBox: {
        backgroundColor: "white",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "10px",
        textAlign: "right"
    },


    checkoutButton: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "12px 25px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px"
    }

};


export default Cart;