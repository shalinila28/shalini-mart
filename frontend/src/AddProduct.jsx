import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function AddProduct() {

    const navigate = useNavigate();

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    const sellerId = loggedInUser?.id;

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "",
        imageUrl: ""
    });

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // ==============================
    // LOGIN & SELLER CHECK
    // ==============================
    useEffect(() => {
        if (!loggedInUser) {
            navigate("/login");
            return;
        }

        const role = loggedInUser.role
            ? String(loggedInUser.role).trim().toUpperCase()
            : "";

        if (role !== "SELLER") {
            navigate("/");
            return;
        }
    }, [loggedInUser, navigate]);

    if (!loggedInUser) {
        return null;
    }

    // ==============================
    // HANDLE INPUT
    // ==============================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==============================
    // IMAGE UPLOAD (FILE -> BASE64)
    // ==============================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setProduct((prev) => ({
                ...prev,
                imageUrl: reader.result
            }));
        };
        reader.onerror = () => {
            alert("Unable to read image.");
        };
        reader.readAsDataURL(file);
    };

    // ==============================
    // ADD PRODUCT
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);

        if (!sellerId) {
            setMessage("Seller session expired. Please log in again.");
            return;
        }

        if (!product.name.trim()) {
            setMessage("Please enter product name.");
            return;
        }

        if (product.price === "" || Number(product.price) < 0) {
            setMessage("Please enter a valid price.");
            return;
        }

        if (product.stockQuantity === "" || Number(product.stockQuantity) < 0) {
            setMessage("Please enter a valid stock quantity.");
            return;
        }

        setLoading(true);

        const requestBody = {
            sellerId: Number(sellerId),
            name: product.name.trim(),
            description: product.description.trim(),
            price: Number(product.price),
            stockQuantity: Number(product.stockQuantity),
            category: product.category.trim(),
            imageUrl: product.imageUrl || ""
        };

        try {
            // Try railway URL first or configured base URL
            const targetUrl = API_BASE_URL
                ? `${API_BASE_URL}/api/products`
                : "https://shalini-mart-production.up.railway.app/api/products";

            let response = await fetch(targetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok && targetUrl.includes("localhost")) {
                // Fallback to Railway if local fails
                response = await fetch("https://shalini-mart-production.up.railway.app/api/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                });
            }

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || "Unable to add product");
            }

            setIsSuccess(true);
            setMessage("🎉 Product added successfully to your catalog!");

            setProduct({
                name: "",
                description: "",
                price: "",
                stockQuantity: "",
                category: "",
                imageUrl: ""
            });

            const fileInput = document.getElementById("productImageInput");
            if (fileInput) fileInput.value = "";

        } catch (error) {
            console.error("ADD PRODUCT ERROR:", error);
            setIsSuccess(false);
            setMessage(error.message || "Cannot connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.navRow}>
                    <button
                        style={styles.back}
                        onClick={() => navigate("/seller-dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        style={styles.viewProductsLink}
                        onClick={() => navigate("/seller/products")}
                    >
                        🛍️ View My Products
                    </button>
                </div>

                <h1 style={styles.heading}>
                    ➕ Add New Product
                </h1>

                <p style={styles.subheading}>
                    Fill in details below to publish a product on ShaliniMart
                </p>

                {message && (
                    <div style={isSuccess ? styles.successMessage : styles.errorMessage}>
                        {message}
                        {isSuccess && (
                            <div style={{ marginTop: "10px" }}>
                                <button
                                    type="button"
                                    style={styles.viewBtnInMsg}
                                    onClick={() => navigate("/seller/products")}
                                >
                                    🛍️ Go to My Products
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <label style={styles.label}>Product Name *</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="e.g. Wireless Bluetooth Headphones"
                        required
                    />

                    <label style={styles.label}>Description *</label>
                    <textarea
                        style={styles.textarea}
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Provide detailed description of the product..."
                        rows={4}
                        required
                    />

                    <div style={styles.row}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Price (₹) *</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="e.g. 1499"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Stock Quantity *</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="stockQuantity"
                                value={product.stockQuantity}
                                onChange={handleChange}
                                placeholder="e.g. 50"
                                min="0"
                                step="1"
                                required
                            />
                        </div>
                    </div>

                    <label style={styles.label}>Category *</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        placeholder="e.g. Electronics, Fashion, Home"
                        required
                    />

                    <label style={styles.label}>📷 Product Image File</label>
                    <input
                        id="productImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />

                    <label style={styles.label}>Or Image URL</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="imageUrl"
                        value={product.imageUrl.startsWith("data:") ? "" : product.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />

                    {product.imageUrl && (
                        <div style={styles.previewBox}>
                            <p style={styles.previewTitle}>Image Preview:</p>
                            <img
                                src={product.imageUrl}
                                alt="Preview"
                                style={styles.previewImage}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        style={styles.submit}
                        disabled={loading}
                    >
                        {loading ? "⏳ Adding Product..." : "➕ Add Product"}
                    </button>
                </form>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "30px 20px",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box"
    },
    container: {
        maxWidth: "680px",
        margin: "auto",
        backgroundColor: "white",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
    },
    navRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
    },
    back: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
        padding: "5px 0"
    },
    viewProductsLink: {
        border: "1px solid #2563eb",
        background: "#eff6ff",
        color: "#2563eb",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "14px",
        padding: "7px 15px",
        borderRadius: "8px"
    },
    heading: {
        color: "#172554",
        textAlign: "center",
        margin: "10px 0 5px 0",
        fontSize: "28px"
    },
    subheading: {
        textAlign: "center",
        color: "#64748b",
        margin: "0 0 25px 0",
        fontSize: "15px"
    },
    successMessage: {
        backgroundColor: "#dcfce7",
        color: "#166534",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "bold",
        border: "1px solid #86efac"
    },
    errorMessage: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "bold",
        border: "1px solid #fca5a5"
    },
    viewBtnInMsg: {
        backgroundColor: "#166534",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "14px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },
    row: {
        display: "flex",
        gap: "15px"
    },
    label: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#334155",
        marginBottom: "-6px"
    },
    input: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box"
    },
    textarea: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "inherit",
        resize: "vertical"
    },
    fileInput: {
        padding: "8px 0",
        fontSize: "14px"
    },
    previewBox: {
        marginTop: "5px",
        padding: "12px",
        background: "#f8fafc",
        border: "1px dashed #cbd5e1",
        borderRadius: "10px",
        textAlign: "center"
    },
    previewTitle: {
        margin: "0 0 8px 0",
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "bold"
    },
    previewImage: {
        maxHeight: "180px",
        maxWidth: "100%",
        borderRadius: "8px",
        objectFit: "contain"
    },
    submit: {
        marginTop: "10px",
        padding: "15px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.2s"
    }
};

export default AddProduct;