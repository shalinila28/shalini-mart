import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
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

            loadProducts();

        } catch (error) {

            localStorage.removeItem(
                "loggedInUser"
            );

            navigate("/login");
        }

    }, [navigate]);


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:8080/api/admin/products"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load products"
                );
            }

            const data =
                await response.json();

            setProducts(data);
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
    // DELETE PRODUCT
    // =====================================================

    const deleteProduct = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/products/${id}`,
                {
                    method: "DELETE"
                }
            );

            const result =
                await response.text();


            if (!response.ok) {

                alert(result);
                return;
            }


            alert(result);

            loadProducts();

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend!"
            );
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
                        🛍️ Manage Products
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


            {/* PRODUCTS */}

            {loading ? (

                <h2>
                    Loading products...
                </h2>

            ) : products.length === 0 ? (

                <h2>
                    No products found.
                </h2>

            ) : (

                <>

                    <h2>
                        All Products
                    </h2>


                    {products.map((product) => (

                        <div
                            key={product.id}
                            style={styles.productCard}
                        >

                            <div>

                                <h2>
                                    🛍️ {product.name}
                                </h2>

                                <p>
                                    <strong>
                                        Product ID:
                                    </strong>{" "}
                                    {product.id}
                                </p>

                                <p>
                                    <strong>
                                        Description:
                                    </strong>{" "}
                                    {product.description}
                                </p>

                                <p>
                                    <strong>
                                        Price:
                                    </strong>{" "}
                                    ₹{product.price}
                                </p>

                                <p>
                                    <strong>
                                        Stock:
                                    </strong>{" "}
                                    {product.stockQuantity}
                                </p>

                                <p>
                                    <strong>
                                        Category:
                                    </strong>{" "}
                                    {product.category}
                                </p>

                                <p>
                                    <strong>
                                        Seller ID:
                                    </strong>{" "}
                                    {product.sellerId}
                                </p>

                                {product.imageUrl && (

                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={
                                            styles.image
                                        }
                                    />

                                )}

                            </div>


                            <button
                                style={styles.deleteButton}
                                onClick={() =>
                                    deleteProduct(
                                        product.id
                                    )
                                }
                            >
                                🗑️ Delete Product
                            </button>

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

    productCard: {
        backgroundColor: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    image: {
        width: "150px",
        height: "150px",
        objectFit: "cover",
        borderRadius: "8px",
        marginTop: "10px"
    },

    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "15px"
    }

};

export default AdminProducts;