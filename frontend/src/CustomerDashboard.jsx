import React, { useEffect, useState } from "react";

function CustomerDashboard() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const customerId = loggedInUser?.id;

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    const [reviews, setReviews] = useState({});
    const [reviewRating, setReviewRating] = useState({});
    const [reviewComment, setReviewComment] = useState({});
    const [reviewMessage, setReviewMessage] = useState({});
    const [canReview, setCanReview] = useState({});

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");

    const [loading, setLoading] = useState(true);


    // =========================================================
    // LOAD PRODUCTS
    // =========================================================

    const loadProducts = () => {

        fetch("http://localhost:8080/api/products")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load products");
                }

                return response.json();
            })
            .then(data => {

                setProducts(data);

                data.forEach(product => {
                    loadReviews(product.id);

                    if (customerId) {
                        checkCanReview(product.id);
                    }
                });
            })
            .catch(error => {

                console.error("Product error:", error);

                alert(
                    "Cannot connect to backend while loading products."
                );
            });
    };


    // =========================================================
    // LOAD CART
    // =========================================================

    const loadCart = () => {

        if (!customerId) {
            return;
        }

        fetch(
            `http://localhost:8080/api/cart/${customerId}`
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load cart");
                }

                return response.json();
            })
            .then(data => {

                setCart(data);
            })
            .catch(error => {

                console.error("Cart error:", error);
            });
    };


    // =========================================================
    // LOAD ORDERS
    // =========================================================

    const loadOrders = () => {

        if (!customerId) {
            return;
        }

        fetch(
            `http://localhost:8080/api/orders/customer/${customerId}`
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load orders");
                }

                return response.json();
            })
            .then(data => {

                setOrders(data);
            })
            .catch(error => {

                console.error("Order error:", error);
            });
    };


    // =========================================================
    // LOAD REVIEWS FOR PRODUCT
    // =========================================================

    const loadReviews = (productId) => {

        fetch(
            `http://localhost:8080/api/reviews/product/${productId}`
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load reviews");
                }

                return response.json();
            })
            .then(data => {

                setReviews(previous => ({
                    ...previous,
                    [productId]: data
                }));
            })
            .catch(error => {

                console.error(
                    "Review loading error:",
                    error
                );
            });
    };


    // =========================================================
    // CHECK WHETHER CUSTOMER CAN REVIEW
    // =========================================================

    const checkCanReview = (productId) => {

        if (!customerId) {
            return;
        }

        fetch(
            `http://localhost:8080/api/reviews/can-review?customerId=${customerId}&productId=${productId}`
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Cannot check review permission"
                    );
                }

                return response.json();
            })
            .then(data => {

                setCanReview(previous => ({
                    ...previous,
                    [productId]: data
                }));
            })
            .catch(error => {

                console.error(
                    "Can-review error:",
                    error
                );
            });
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        if (!loggedInUser) {

            alert("Please login first.");

            window.location.href = "/login";

            return;
        }

        if (
            loggedInUser.role &&
            loggedInUser.role.toUpperCase() !== "CUSTOMER"
        ) {

            alert("Customer access only.");

            window.location.href = "/";

            return;
        }

        loadProducts();
        loadCart();
        loadOrders();

        setLoading(false);

    }, []);


    // =========================================================
    // ADD TO CART
    // =========================================================

    const addToCart = (product) => {

        if (!customerId) {

            alert("Customer not logged in.");

            return;
        }

        const cartItem = {

            customerId: customerId,

            productId: product.id,

            quantity: 1,

            price: product.price
        };


        fetch("http://localhost:8080/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(cartItem)
        })
            .then(async response => {

                const text =
                    await response.text();

                if (!response.ok) {

                    throw new Error(text);
                }

                return text;
            })
            .then(() => {

                alert(
                    `${product.name} added to cart!`
                );

                loadCart();
            })
            .catch(error => {

                console.error(
                    "Add cart error:",
                    error
                );

                alert(
                    "Cannot add product to cart.\n\n" +
                    error.message
                );
            });
    };


    // =========================================================
    // UPDATE CART QUANTITY
    // =========================================================

    const updateQuantity = (
        cartItemId,
        quantity
    ) => {

        if (quantity < 1) {
            return;
        }

        fetch(
            `http://localhost:8080/api/cart/${cartItemId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    quantity: quantity
                })
            }
        )
            .then(async response => {

                const text =
                    await response.text();

                if (!response.ok) {

                    throw new Error(text);
                }

                return text;
            })
            .then(() => {

                loadCart();
            })
            .catch(error => {

                console.error(
                    "Update cart error:",
                    error
                );
            });
    };


    // =========================================================
    // DELETE CART ITEM
    // =========================================================

    const removeFromCart = (cartItemId) => {

        fetch(
            `http://localhost:8080/api/cart/${cartItemId}`,
            {
                method: "DELETE"
            }
        )
            .then(async response => {

                const text =
                    await response.text();

                if (!response.ok) {

                    throw new Error(text);
                }

                return text;
            })
            .then(() => {

                loadCart();
            })
            .catch(error => {

                console.error(
                    "Remove cart error:",
                    error
                );
            });
    };


    // =========================================================
    // MARK ORDER AS RECEIVED
    // =========================================================

    const markOrderReceived = (orderId) => {

        const confirmReceived =
            window.confirm(
                "Have you received this order?"
            );

        if (!confirmReceived) {
            return;
        }


        const url =
            `http://localhost:8080/api/orders/${orderId}/received?customerId=${customerId}`;


        console.log(
            "Calling receive API:",
            url
        );


        fetch(url, {

            method: "PUT"
        })
            .then(async response => {

                const text =
                    await response.text();

                console.log(
                    "Receive order status:",
                    response.status
                );

                console.log(
                    "Backend response:",
                    text
                );


                if (!response.ok) {

                    throw new Error(
                        text ||
                        "Failed to mark order as received."
                    );
                }


                return text;
            })
            .then(() => {

                alert(
                    "Order marked as RECEIVED!"
                );


                // Reload orders
                loadOrders();


                // Check review permission again
                products.forEach(product => {

                    checkCanReview(
                        product.id
                    );
                });
            })
            .catch(error => {

                console.error(
                    "Receive order error:",
                    error
                );


                alert(
                    "Cannot mark order as received.\n\n" +
                    error.message
                );
            });
    };


    // =========================================================
    // SUBMIT REVIEW
    // =========================================================

    const submitReview = (productId) => {

        const rating =
            reviewRating[productId];

        const comment =
            reviewComment[productId];


        if (!rating) {

            alert(
                "Please select a rating."
            );

            return;
        }


        const review = {

            productId: productId,

            customerId: customerId,

            rating: Number(rating),

            comment: comment || ""
        };


        fetch(
            "http://localhost:8080/api/reviews",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(review)
            }
        )
            .then(async response => {

                const text =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        text ||
                        "Failed to submit review."
                    );
                }


                return text;
            })
            .then(text => {

                let data;

                try {

                    data = JSON.parse(text);

                } catch {

                    data = null;
                }


                if (
                    typeof data === "string"
                ) {

                    setReviewMessage(
                        previous => ({
                            ...previous,
                            [productId]: data
                        })
                    );

                    return;
                }


                setReviewMessage(
                    previous => ({
                        ...previous,
                        [productId]:
                            "Review submitted successfully!"
                    })
                );


                setReviewRating(
                    previous => ({
                        ...previous,
                        [productId]: ""
                    })
                );


                setReviewComment(
                    previous => ({
                        ...previous,
                        [productId]: ""
                    })
                );


                loadReviews(productId);

                checkCanReview(productId);
            })
            .catch(error => {

                console.error(
                    "Review error:",
                    error
                );


                setReviewMessage(
                    previous => ({
                        ...previous,
                        [productId]:
                            error.message
                    })
                );
            });
    };


    // =========================================================
    // EDIT REVIEW
    // =========================================================

    const editReview = (review) => {

        const newRating =
            window.prompt(
                "Enter new rating (1-5):",
                review.rating
            );


        if (newRating === null) {
            return;
        }


        const ratingNumber =
            Number(newRating);


        if (
            ratingNumber < 1 ||
            ratingNumber > 5 ||
            !Number.isInteger(ratingNumber)
        ) {

            alert(
                "Rating must be between 1 and 5."
            );

            return;
        }


        const newComment =
            window.prompt(
                "Enter your new comment:",
                review.comment || ""
            );


        if (newComment === null) {
            return;
        }


        fetch(
            `http://localhost:8080/api/reviews/${review.id}?customerId=${customerId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    rating: ratingNumber,

                    comment: newComment
                })
            }
        )
            .then(async response => {

                const text =
                    await response.text();


                if (!response.ok) {

                    throw new Error(text);
                }


                return text;
            })
            .then(() => {

                alert(
                    "Review updated successfully!"
                );


                loadReviews(
                    review.productId
                );
            })
            .catch(error => {

                console.error(
                    "Edit review error:",
                    error
                );


                alert(
                    "Cannot update review.\n\n" +
                    error.message
                );
            });
    };


    // =========================================================
    // DELETE REVIEW
    // =========================================================

    const deleteReview = (review) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this review?"
            );


        if (!confirmDelete) {
            return;
        }


        fetch(
            `http://localhost:8080/api/reviews/${review.id}?customerId=${customerId}`,
            {

                method: "DELETE"
            }
        )
            .then(async response => {

                const text =
                    await response.text();


                if (!response.ok) {

                    throw new Error(text);
                }


                return text;
            })
            .then(() => {

                alert(
                    "Review deleted successfully!"
                );


                loadReviews(
                    review.productId
                );
            })
            .catch(error => {

                console.error(
                    "Delete review error:",
                    error
                );


                alert(
                    "Cannot delete review.\n\n" +
                    error.message
                );
            });
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {

        localStorage.removeItem(
            "loggedInUser"
        );

        window.location.href = "/login";
    };


    // =========================================================
    // CART TOTAL
    // =========================================================

    const getTotal = () => {

        return cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );
    };


    // =========================================================
    // FILTER PRODUCTS
    // =========================================================

    const categories = [
        "ALL",
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ];


    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                product.description
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const matchesCategory =
                category === "ALL" ||
                product.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );
        });


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div style={styles.loading}>
                Loading Customer Dashboard...
            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div style={styles.page}>

            {/* HEADER */}

            <header style={styles.header}>

                <div>

                    <h1>
                        🛍️ ShaliniMart
                    </h1>

                    <p>
                        Welcome,{" "}
                        <b>
                            {loggedInUser?.username}
                        </b>
                    </p>

                </div>


                <div>

                    <button
                        style={styles.cartButton}
                        onClick={() =>
                            window.location.href =
                                "/cart"
                        }
                    >
                        🛒 Cart ({cart.length})
                    </button>


                    <button
                        style={styles.logoutButton}
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* SEARCH */}

            <section style={styles.searchSection}>

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e =>
                        setSearch(e.target.value)
                    }
                    style={styles.searchInput}
                />


                <select
                    value={category}
                    onChange={e =>
                        setCategory(e.target.value)
                    }
                    style={styles.categorySelect}
                >

                    {categories.map(cat => (

                        <option
                            key={cat}
                            value={cat}
                        >
                            {cat}
                        </option>

                    ))}

                </select>

            </section>


            {/* PRODUCTS */}

            <h2>
                🛍️ Products
            </h2>


            <div style={styles.productGrid}>

                {filteredProducts.map(product => (

                    <div
                        key={product.id}
                        style={styles.productCard}
                    >

                        {product.imageUrl && (

                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                style={
                                    styles.productImage
                                }
                            />

                        )}


                        <h3>
                            {product.name}
                        </h3>


                        <p>
                            {product.description}
                        </p>


                        <p>
                            <b>
                                ₹
                                {product.price}
                            </b>
                        </p>


                        <p>
                            Category:{" "}
                            {product.category}
                        </p>


                        <p>
                            Stock:{" "}
                            {product.stockQuantity}
                        </p>


                        <button
                            style={styles.addButton}
                            onClick={() =>
                                addToCart(product)
                            }
                            disabled={
                                product.stockQuantity <= 0
                            }
                        >

                            {product.stockQuantity > 0
                                ? "🛒 Add to Cart"
                                : "Out of Stock"}

                        </button>


                        {/* REVIEWS */}

                        <div style={styles.reviewSection}>

                            <h4>
                                ⭐ Customer Reviews
                            </h4>


                            {reviews[product.id] &&
                            reviews[product.id].length > 0 ? (

                                reviews[product.id].map(
                                    review => (

                                        <div
                                            key={
                                                review.id
                                            }
                                            style={
                                                styles.reviewCard
                                            }
                                        >

                                            <p>
                                                {"⭐".repeat(
                                                    review.rating
                                                )}
                                            </p>


                                            <p>
                                                {review.comment}
                                            </p>


                                            {review.customerId ===
                                                customerId && (

                                                <div>

                                                    <button
                                                        onClick={() =>
                                                            editReview(
                                                                review
                                                            )
                                                        }
                                                        style={
                                                            styles.editButton
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            deleteReview(
                                                                review
                                                            )
                                                        }
                                                        style={
                                                            styles.deleteButton
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    )
                                )

                            ) : (

                                <p>
                                    No reviews yet.
                                </p>

                            )}


                            {/* REVIEW FORM */}

                            {canReview[product.id] ? (

                                <div
                                    style={
                                        styles.reviewForm
                                    }
                                >

                                    <h4>
                                        ⭐ Give Your Review
                                    </h4>


                                    <p>
                                        You have received
                                        this product.
                                    </p>


                                    <select
                                        value={
                                            reviewRating[
                                                product.id
                                            ] || ""
                                        }
                                        onChange={e =>
                                            setReviewRating(
                                                previous => ({
                                                    ...previous,
                                                    [product.id]:
                                                        e.target.value
                                                })
                                            )
                                        }
                                        style={
                                            styles.ratingSelect
                                        }
                                    >

                                        <option value="">
                                            Select Rating
                                        </option>

                                        <option value="1">
                                            ⭐ 1
                                        </option>

                                        <option value="2">
                                            ⭐⭐ 2
                                        </option>

                                        <option value="3">
                                            ⭐⭐⭐ 3
                                        </option>

                                        <option value="4">
                                            ⭐⭐⭐⭐ 4
                                        </option>

                                        <option value="5">
                                            ⭐⭐⭐⭐⭐ 5
                                        </option>

                                    </select>


                                    <textarea
                                        placeholder="Write your review..."
                                        value={
                                            reviewComment[
                                                product.id
                                            ] || ""
                                        }
                                        onChange={e =>
                                            setReviewComment(
                                                previous => ({
                                                    ...previous,
                                                    [product.id]:
                                                        e.target.value
                                                })
                                            )
                                        }
                                        style={
                                            styles.commentBox
                                        }
                                    />


                                    <button
                                        style={
                                            styles.submitReviewButton
                                        }
                                        onClick={() =>
                                            submitReview(
                                                product.id
                                            )
                                        }
                                    >
                                        Submit Review
                                    </button>


                                    {reviewMessage[
                                        product.id
                                    ] && (

                                        <p
                                            style={
                                                styles.message
                                            }
                                        >
                                            {
                                                reviewMessage[
                                                    product.id
                                                ]
                                            }
                                        </p>

                                    )}

                                </div>

                            ) : (

                                <div
                                    style={
                                        styles.reviewLocked
                                    }
                                >

                                    🔒{" "}
                                    <b>
                                        Review Locked
                                    </b>

                                    <p>
                                        Purchase and receive
                                        this product first
                                        to give a rating
                                        and review.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                ))}

            </div>


            {/* ORDER HISTORY */}

            <section style={styles.ordersSection}>

                <h2>
                    📦 My Orders
                </h2>


                {orders.length === 0 ? (

                    <p>
                        You have no orders yet.
                    </p>

                ) : (

                    orders.map(order => (

                        <div
                            key={order.id}
                            style={styles.orderCard}
                        >

                            <h3>
                                Order #{order.id}
                            </h3>


                            <p>
                                Total: ₹
                                {order.totalAmount}
                            </p>


                            <p>
                                Status:{" "}
                                <b>
                                    {order.status}
                                </b>
                            </p>


                            <p>
                                Order Date:{" "}
                                {order.orderDate}
                            </p>


                            {order.status ===
                                "CONFIRMED" && (

                                <div>

                                    <p>
                                        🚚 Your order has
                                        been confirmed.
                                        <br />

                                        Once you receive
                                        the product, click
                                        the button below.
                                    </p>


                                    <button
                                        style={
                                            styles.receiveButton
                                        }
                                        onClick={() =>
                                            markOrderReceived(
                                                order.id
                                            )
                                        }
                                    >
                                        📦 I Received This
                                        Order
                                    </button>

                                </div>

                            )}


                            {order.status ===
                                "RECEIVED" && (

                                <div
                                    style={
                                        styles.receivedMessage
                                    }
                                >

                                    ✅ Order Received

                                    <p>
                                        You can now give
                                        a rating and review
                                        for the products
                                        you purchased.
                                    </p>

                                </div>

                            )}

                        </div>

                    ))

                )}

            </section>


            {/* CART SUMMARY */}

            <section style={styles.cartSummary}>

                <h2>
                    🛒 Cart Summary
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
                                style={
                                    styles.cartItem
                                }
                            >

                                <span>
                                    Product ID:{" "}
                                    {item.productId}
                                </span>


                                <div>

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


                                    <span
                                        style={{
                                            margin:
                                                "0 10px"
                                        }}
                                    >
                                        {item.quantity}
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


                                    <button
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                        style={
                                            styles.removeButton
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}


                        <h3>
                            Total: ₹
                            {getTotal()}
                        </h3>


                        <button
                            style={
                                styles.goCartButton
                            }
                            onClick={() =>
                                window.location.href =
                                    "/cart"
                            }
                        >
                            Go To Cart / Checkout
                        </button>

                    </>

                )}

            </section>

        </div>
    );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

    page: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh"
    },

    loading: {
        padding: "50px",
        textAlign: "center",
        fontSize: "22px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "10px",
        marginBottom: "20px"
    },

    cartButton: {
        padding: "10px 15px",
        marginRight: "10px",
        cursor: "pointer"
    },

    logoutButton: {
        padding: "10px 15px",
        cursor: "pointer"
    },

    searchSection: {
        display: "flex",
        gap: "10px",
        marginBottom: "25px"
    },

    searchInput: {
        padding: "12px",
        width: "60%",
        fontSize: "16px"
    },

    categorySelect: {
        padding: "12px",
        fontSize: "16px"
    },

    productGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
    },

    productCard: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    productImage: {
        width: "100%",
        height: "200px",
        objectFit: "cover",
        borderRadius: "8px"
    },

    addButton: {
        padding: "10px 15px",
        cursor: "pointer",
        width: "100%"
    },

    reviewSection: {
        marginTop: "20px",
        borderTop: "1px solid #ddd",
        paddingTop: "15px"
    },

    reviewCard: {
        backgroundColor: "#f9f9f9",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px"
    },

    reviewForm: {
        marginTop: "15px",
        padding: "15px",
        backgroundColor: "#eef8ff",
        borderRadius: "8px"
    },

    reviewLocked: {
        marginTop: "15px",
        padding: "15px",
        backgroundColor: "#f1f1f1",
        borderRadius: "8px"
    },

    ratingSelect: {
        padding: "8px",
        marginBottom: "10px",
        width: "100%"
    },

    commentBox: {
        width: "100%",
        minHeight: "80px",
        padding: "8px",
        boxSizing: "border-box",
        marginBottom: "10px"
    },

    submitReviewButton: {
        padding: "10px 15px",
        cursor: "pointer"
    },

    editButton: {
        marginRight: "8px",
        padding: "5px 10px",
        cursor: "pointer"
    },

    deleteButton: {
        padding: "5px 10px",
        cursor: "pointer"
    },

    message: {
        fontWeight: "bold"
    },

    ordersSection: {
        marginTop: "40px"
    },

    orderCard: {
        backgroundColor: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 6px rgba(0,0,0,0.1)"
    },

    receiveButton: {
        padding: "12px 18px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    receivedMessage: {
        backgroundColor: "#e8f5e9",
        padding: "12px",
        borderRadius: "8px"
    },

    cartSummary: {
        marginTop: "40px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px"
    },

    cartItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #ddd"
    },

    removeButton: {
        marginLeft: "15px",
        padding: "5px 10px",
        cursor: "pointer"
    },

    goCartButton: {
        padding: "12px 20px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default CustomerDashboard;