import React, { useEffect, useState } from "react";

function CustomerDashboard() {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const customerId = loggedInUser?.id;


    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {

        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error(
                    "Product loading error:",
                    error
                );
            });

    }, []);


    // =========================
    // LOAD CART
    // =========================

    const loadCart = () => {

        if (!customerId) {
            return;
        }

        fetch(
            `http://localhost:8080/api/cart/${customerId}`
        )
            .then(response => response.json())
            .then(data => {
                setCart(data);
            })
            .catch(error => {
                console.error(
                    "Cart loading error:",
                    error
                );
            });
    };


    useEffect(() => {
        loadCart();
    }, [customerId]);


    // =========================
    // LOAD ORDER HISTORY
    // =========================

    const loadOrders = () => {

        if (!customerId) {
            return;
        }

        fetch(
            `http://localhost:8080/api/orders/customer/${customerId}`
        )
            .then(response => response.json())
            .then(data => {
                setOrders(data);
            })
            .catch(error => {
                console.error(
                    "Order history loading error:",
                    error
                );
            });
    };


    useEffect(() => {
        loadOrders();
    }, [customerId]);


    // =========================
    // ADD TO CART
    // =========================

    const addToCart = async (product) => {

        if (!loggedInUser) {

            alert("Please login first.");

            return;
        }

        if (loggedInUser.role !== "CUSTOMER") {

            alert(
                "Only customers can add products to cart."
            );

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        customerId: customerId,
                        productId: product.id,
                        quantity: 1,
                        price: product.price
                    })
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                alert(
                    "Failed to add product: " +
                    errorText
                );

                return;
            }

            alert(
                product.name +
                " added to cart successfully!"
            );

            loadCart();

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend."
            );
        }
    };


    // =========================
    // UPDATE QUANTITY
    // =========================

    const updateQuantity = async (
        cartItem,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/cart/${cartItem.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        quantity: newQuantity
                    })
                }
            );

            if (!response.ok) {

                alert(
                    "Unable to update quantity."
                );

                return;
            }

            loadCart();

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend."
            );
        }
    };


    // =========================
    // REMOVE FROM CART
    // =========================

    const removeFromCart = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/cart/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {

                alert(
                    "Unable to remove item."
                );

                return;
            }

            loadCart();

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend."
            );
        }
    };


    // =========================
    // CALCULATE TOTAL
    // =========================

    const getTotal = () => {

        return cart.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );
    };


    // =========================
    // CHECKOUT
    // =========================

    const checkout = async () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }

        const confirmPayment =
            window.confirm(
                `Confirm mock payment of ₹${getTotal()}?`
            );

        if (!confirmPayment) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/orders/checkout/${customerId}`,
                {
                    method: "POST"
                }
            );

            const result =
                await response.text();

            if (!response.ok) {

                alert(
                    "Checkout failed: " +
                    result
                );

                return;
            }

            setMessage(result);

            alert(result);

            // Refresh cart
            loadCart();

            // Refresh order history
            loadOrders();

        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );

            alert(
                "Cannot connect to backend."
            );
        }
    };


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem(
            "loggedInUser"
        );

        window.location.href = "/";
    };


    // =========================
    // DISPLAY
    // =========================

    return (

        <div
            style={{
                padding: "30px",
                fontFamily: "Arial"
            }}
        >

            <h1>
                Customer Dashboard
            </h1>

            <p>
                Welcome, {loggedInUser?.username}
            </p>

            <button onClick={logout}>
                Logout
            </button>


            {/* ================= PRODUCTS ================= */}

            <h2>
                Available Products
            </h2>

            {products.length === 0 ? (

                <p>
                    No products available.
                </p>

            ) : (

                products.map(product => (

                    <div
                        key={product.id}
                        style={{
                            border: "1px solid gray",
                            padding: "15px",
                            margin: "10px 0"
                        }}
                    >

                        <h3>
                            {product.name}
                        </h3>

                        <p>
                            {product.description}
                        </p>

                        <p>
                            Price: ₹{product.price}
                        </p>

                        <p>
                            Stock: {product.stockQuantity}
                        </p>

                        <p>
                            Category: {product.category}
                        </p>

                        {product.imageUrl && (

                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                width="150"
                            />

                        )}

                        <br />
                        <br />

                        <button
                            onClick={() =>
                                addToCart(product)
                            }
                        >
                            Add to Cart
                        </button>

                    </div>

                ))
            )}


            <hr />


            {/* ================= CART ================= */}

            <h2>
                🛒 My Cart
            </h2>

            {cart.length === 0 ? (

                <p>
                    Your cart is empty.
                </p>

            ) : (

                <>

                    {cart.map(item => (

                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #aaa",
                                padding: "15px",
                                margin: "10px 0"
                            }}
                        >

                            <p>
                                Product ID: {item.productId}
                            </p>

                            <p>
                                Price: ₹{item.price}
                            </p>


                            {/* QUANTITY */}

                            <div>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item,
                                            item.quantity - 1
                                        )
                                    }
                                >
                                    -
                                </button>

                                <span
                                    style={{
                                        margin: "0 15px"
                                    }}
                                >
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item,
                                            item.quantity + 1
                                        )
                                    }
                                >
                                    +
                                </button>

                            </div>


                            {/* SUBTOTAL */}

                            <p>
                                Subtotal: ₹
                                {item.price *
                                    item.quantity}
                            </p>


                            {/* REMOVE */}

                            <button
                                onClick={() =>
                                    removeFromCart(
                                        item.id
                                    )
                                }
                            >
                                Remove
                            </button>

                        </div>

                    ))}


                    {/* TOTAL */}

                    <h2>
                        Total: ₹{getTotal()}
                    </h2>


                    {/* CHECKOUT */}

                    <button
                        onClick={checkout}
                        style={{
                            padding: "12px 25px",
                            fontSize: "18px"
                        }}
                    >
                        💳 Checkout
                    </button>

                </>
            )}


            {/* ================= SUCCESS MESSAGE ================= */}

            {message && (

                <h3>
                    ✅ {message}
                </h3>

            )}


            <hr />


            {/* ================= ORDER HISTORY ================= */}

            <h2>
                📦 My Orders
            </h2>

            {orders.length === 0 ? (

                <p>
                    No orders found.
                </p>

            ) : (

                orders.map(order => (

                    <div
                        key={order.id}
                        style={{
                            border: "1px solid green",
                            padding: "15px",
                            margin: "10px 0"
                        }}
                    >

                        <h3>
                            Order ID: {order.id}
                        </h3>

                        <p>
                            Customer ID: {order.customerId}
                        </p>

                        <p>
                            Total Amount: ₹
                            {order.totalAmount}
                        </p>

                        <p>
                            Status: {order.status}
                        </p>

                    </div>

                ))
            )}

        </div>
    );
}

export default CustomerDashboard;