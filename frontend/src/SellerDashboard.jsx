import React, { useEffect, useState } from "react";

function SellerDashboard() {

    // =====================================================
    // GET LOGGED-IN SELLER
    // =====================================================

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const sellerId = loggedInUser?.id;


    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);


    // =====================================================
    // SELLER ORDERS - F6
    // =====================================================

    const [sellerOrders, setSellerOrders] = useState([]);


    // =====================================================
    // PRODUCT FORM
    // =====================================================

    const [product, setProduct] = useState({

        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "",
        imageUrl: ""

    });


    // =====================================================
    // EDITING PRODUCT ID
    // =====================================================

    const [editingId, setEditingId] = useState(null);


    // =====================================================
    // MESSAGE
    // =====================================================

    const [message, setMessage] = useState("");


    // =====================================================
    // LOAD DATA WHEN DASHBOARD OPENS
    // =====================================================

    useEffect(() => {

        loadProducts();
        loadSellerOrders();

    }, []);


    // =====================================================
    // LOAD ALL PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/products"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load products"
                );

            }

            const data = await response.json();

            setProducts(data);

        } catch (error) {

            console.error(
                "Error loading products:",
                error
            );

            setMessage(
                "Unable to load products!"
            );
        }
    };


    // =====================================================
    // LOAD SELLER INCOMING ORDERS
    // =====================================================

    const loadSellerOrders = async () => {

        if (!sellerId) {

            console.error(
                "Seller ID not found"
            );

            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/orders/seller/${sellerId}`
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load seller orders"
                );

            }

            const data = await response.json();

            setSellerOrders(data);

        } catch (error) {

            console.error(
                "Error loading seller orders:",
                error
            );
        }
    };


    // =====================================================
    // HANDLE PRODUCT INPUT
    // =====================================================

    const handleChange = (e) => {

        setProduct({

            ...product,

            [e.target.name]: e.target.value

        });
    };


    // =====================================================
    // ADD / UPDATE PRODUCT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Seller ID check

        if (!sellerId) {

            setMessage(
                "Seller information not found. Please login again."
            );

            return;
        }


        try {

            let response;


            // =================================================
            // UPDATE PRODUCT
            // =================================================

            if (editingId !== null) {

                response = await fetch(

                    `http://localhost:8080/api/products/${editingId}?sellerId=${sellerId}`,

                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(product)
                    }
                );

            }


            // =================================================
            // ADD PRODUCT
            // =================================================

            else {

                response = await fetch(

                    "http://localhost:8080/api/products",

                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            ...product,

                            sellerId: sellerId

                        })
                    }
                );
            }


            // Read backend response

            const result =
                await response.text();


            // If backend error

            if (!response.ok) {

                setMessage(result);

                return;
            }


            // Success message

            if (editingId !== null) {

                setMessage(
                    "Product updated successfully!"
                );

            } else {

                setMessage(
                    "Product added successfully!"
                );
            }


            // Clear form

            setProduct({

                name: "",
                description: "",
                price: "",
                stockQuantity: "",
                category: "",
                imageUrl: ""

            });


            // Exit edit mode

            setEditingId(null);


            // Reload products

            loadProducts();

        } catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend!"
            );
        }
    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const editProduct = (item) => {


        // Check ownership

        if (item.sellerId !== sellerId) {

            alert(
                "You can edit only your own products."
            );

            return;
        }


        // Put product data into form

        setProduct({

            name: item.name,

            description: item.description,

            price: item.price,

            stockQuantity: item.stockQuantity,

            category: item.category,

            imageUrl: item.imageUrl

        });


        // Store product ID

        setEditingId(item.id);


        // Clear old message

        setMessage("");
    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const deleteProduct = async (
        id,
        productSellerId
    ) => {


        // Check ownership

        if (productSellerId !== sellerId) {

            alert(
                "You can delete only your own products."
            );

            return;
        }


        // Confirmation

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmDelete) {

            return;
        }


        try {

            const response = await fetch(

                `http://localhost:8080/api/products/${id}?sellerId=${sellerId}`,

                {
                    method: "DELETE"
                }
            );


            const result =
                await response.text();


            if (!response.ok) {

                setMessage(result);

                return;
            }


            setMessage(
                "Product deleted successfully!"
            );


            // Reload products

            loadProducts();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to delete product!"
            );
        }
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {

        setEditingId(null);

        setProduct({

            name: "",
            description: "",
            price: "",
            stockQuantity: "",
            category: "",
            imageUrl: ""

        });

        setMessage("");
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={{
                padding: "30px",
                fontFamily: "Arial",
                maxWidth: "1000px",
                margin: "auto"
            }}
        >


            {/* =================================================
                SELLER HEADER
            ================================================= */}

            <h1>
                Seller Dashboard
            </h1>


            <p>
                <strong>
                    Logged in Seller:
                </strong>{" "}
                {loggedInUser?.username}
            </p>


            <p>
                <strong>
                    Seller ID:
                </strong>{" "}
                {sellerId}
            </p>


            <hr />


            {/* =================================================
                PRODUCT FORM
            ================================================= */}

            <h2>

                {editingId !== null
                    ? "Edit Product"
                    : "Add Product"}

            </h2>


            <form onSubmit={handleSubmit}>


                {/* PRODUCT NAME */}

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />


                {/* DESCRIPTION */}

                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={product.description}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />


                {/* PRICE */}

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <br />
                <br />


                {/* STOCK */}

                <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={product.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <br />
                <br />


                {/* CATEGORY */}

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={product.category}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />


                {/* IMAGE URL */}

                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={product.imageUrl}
                    onChange={handleChange}
                />

                <br />
                <br />


                {/* SUBMIT BUTTON */}

                <button type="submit">

                    {editingId !== null
                        ? "Update Product"
                        : "Add Product"}

                </button>


                {/* CANCEL BUTTON */}

                {editingId !== null && (

                    <button
                        type="button"
                        onClick={cancelEdit}
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Cancel
                    </button>

                )}

            </form>


            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (

                <h3>
                    {message}
                </h3>

            )}


            <hr />


            {/* =================================================
                ALL PRODUCTS
            ================================================= */}

            <h2>
                All Products
            </h2>


            <p>
                You can view all sellers' products,
                but you can edit or delete only your
                own products.
            </p>


            {products.length === 0 ? (

                <p>
                    No products available.
                </p>

            ) : (

                products.map((item) => (

                    <div
                        key={item.id}
                        style={{
                            border: "1px solid gray",
                            padding: "15px",
                            margin: "10px 0",
                            borderRadius: "8px"
                        }}
                    >


                        <h3>
                            {item.name}
                        </h3>


                        <p>
                            {item.description}
                        </p>


                        <p>
                            <strong>
                                Price:
                            </strong>{" "}
                            ₹{item.price}
                        </p>


                        <p>
                            <strong>
                                Stock:
                            </strong>{" "}
                            {item.stockQuantity}
                        </p>


                        <p>
                            <strong>
                                Category:
                            </strong>{" "}
                            {item.category}
                        </p>


                        <p>
                            <strong>
                                Seller ID:
                            </strong>{" "}
                            {item.sellerId}
                        </p>


                        {/* IMAGE */}

                        {item.imageUrl && (

                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                width="150"
                            />

                        )}


                        <br />
                        <br />


                        {/* =================================================
                            OWN PRODUCT
                        ================================================= */}

                        {item.sellerId === sellerId ? (

                            <>

                                <button
                                    onClick={() =>
                                        editProduct(item)
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        deleteProduct(
                                            item.id,
                                            item.sellerId
                                        )
                                    }
                                    style={{
                                        marginLeft: "10px"
                                    }}
                                >
                                    Delete
                                </button>

                            </>

                        ) : (

                            /* =================================================
                               OTHER SELLER PRODUCT
                            ================================================= */

                            <p>
                                👁️ <strong>View only</strong>
                                <br />
                                This product belongs to
                                another seller.
                            </p>

                        )}

                    </div>

                ))

            )}


            {/* =================================================
                F6 - INCOMING ORDERS
            ================================================= */}

            <hr />


            <h2>
                Incoming Orders
            </h2>


            <p>
                Orders received for your products.
            </p>


            {sellerOrders.length === 0 ? (

                <p>
                    No incoming orders yet.
                </p>

            ) : (

                sellerOrders.map((order, index) => (

                    <div
                        key={index}
                        style={{
                            border: "1px solid gray",
                            padding: "15px",
                            margin: "10px 0",
                            borderRadius: "8px"
                        }}
                    >


                        <h3>
                            Order ID: {order.orderId}
                        </h3>


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

export default SellerDashboard;