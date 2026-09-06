import React, { useEffect, useState } from "react";

function Cart() {

    const [cartItems, setCartItems] = useState([]);

    // Temporary customer ID for testing
    const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );

const customerId = loggedInUser.id;

    // =========================
    // LOAD CART
    // =========================

    const loadCart = async () => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/cart/${customerId}`
            );

            const data = await response.json();

            setCartItems(data);

        } catch (error) {

            console.error("Error loading cart:", error);

        }
    };


    useEffect(() => {

        loadCart();

    }, []);


    // =========================
    // UPDATE QUANTITY
    // =========================

    const updateQuantity = async (id, quantity) => {

        if (quantity < 1) {
            return;
        }

        try {

            await fetch(
                `http://localhost:8080/api/cart/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        quantity: quantity
                    })
                }
            );

            loadCart();

        } catch (error) {

            console.error("Error updating quantity:", error);

        }
    };


    // =========================
    // REMOVE ITEM
    // =========================

    const removeItem = async (id) => {

        try {

            await fetch(
                `http://localhost:8080/api/cart/${id}`,
                {
                    method: "DELETE"
                }
            );

            loadCart();

        } catch (error) {

            console.error("Error removing item:", error);

        }
    };


    // =========================
    // RUNNING TOTAL
    // =========================

    const total = cartItems.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );


    return (

        <div>

            <h1>My Cart</h1>

            {cartItems.length === 0 ? (

                <p>Your cart is empty.</p>

            ) : (

                <>

                    {cartItems.map((item) => (

                        <div key={item.id}>

                            <h3>
                                Product ID: {item.productId}
                            </h3>

                            <p>
                                Price: ₹{item.price}
                            </p>

                            <p>
                                Quantity:
                            </p>

                            <button
                                onClick={() =>
                                    updateQuantity(
                                        item.id,
                                        item.quantity - 1
                                    )
                                }
                            >
                                -
                            </button>

                            <span>
                                {" "}{item.quantity}{" "}
                            </span>

                            <button
                                onClick={() =>
                                    updateQuantity(
                                        item.id,
                                        item.quantity + 1
                                    )
                                }
                            >
                                +
                            </button>

                            <br /><br />

                            <button
                                onClick={() =>
                                    removeItem(item.id)
                                }
                            >
                                Remove
                            </button>

                            <hr />

                        </div>

                    ))}


                    <h2>
                        Running Total: ₹{total}
                    </h2>

                </>

            )}

        </div>

    );
}

export default Cart;