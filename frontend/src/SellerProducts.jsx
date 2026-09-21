import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerProducts() {

    const navigate = useNavigate();

    // =====================================================
    // LOGGED-IN SELLER
    // =====================================================

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    const sellerId = loggedInUser?.id;


    // =====================================================
    // STATES
    // =====================================================

    const [products, setProducts] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "",
        imageUrl: ""
    });


    // =====================================================
    // EMPTY FORM
    // =====================================================

    const emptyProduct = {
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "",
        imageUrl: ""
    };


    // =====================================================
    // LOGIN CHECK
    // =====================================================

    useEffect(() => {

        if (!loggedInUser) {

            navigate("/login");

            return;
        }

        if (
            String(loggedInUser.role).toUpperCase()
            !== "SELLER"
        ) {

            navigate("/");

            return;
        }

        loadProducts();

    }, []);


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            const response = await fetch(
                "https://shalini-mart-production.up.railway.app/api/products"
            );

            const text = await response.text();

            if (!response.ok) {

                throw new Error(text);
            }

            const data = text
                ? JSON.parse(text)
                : [];

            setProducts(data);

        } catch (error) {

            console.error(
                "LOAD PRODUCTS ERROR:",
                error
            );

            setMessage(
                "Unable to load products: "
                + error.message
            );
        }
    };


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProduct((previous) => ({

            ...previous,

            [name]: value

        }));
    };


    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }


        // IMAGE TYPE

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image."
            );

            e.target.value = "";

            return;
        }


        // IMAGE SIZE

        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Image must be smaller than 5 MB."
            );

            e.target.value = "";

            return;
        }


        // CONVERT TO BASE64

        const reader = new FileReader();

        reader.onload = () => {

            setProduct((previous) => ({

                ...previous,

                imageUrl: reader.result

            }));
        };

        reader.onerror = () => {

            alert(
                "Unable to read image."
            );
        };

        reader.readAsDataURL(file);
    };


    // =====================================================
    // ADD / UPDATE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");


        // SELLER CHECK

        if (!sellerId) {

            setMessage(
                "Seller information not found. Please login again."
            );

            return;
        }


        // BASIC VALIDATION

        if (!product.name.trim()) {

            setMessage(
                "Please enter product name."
            );

            return;
        }


        if (product.price === ""
            || Number(product.price) < 0) {

            setMessage(
                "Please enter a valid price."
            );

            return;
        }


        if (
            product.stockQuantity === ""
            || Number(product.stockQuantity) < 0
        ) {

            setMessage(
                "Please enter a valid stock quantity."
            );

            return;
        }


        setLoading(true);


        try {

            let url;

            let method;


            // =================================================
            // UPDATE
            // =================================================

            if (editingId !== null) {

                url =
                    `https://shalini-mart-production.up.railway.app/api/products/${editingId}?sellerId=${sellerId}`;

                method = "PUT";

            }


            // =================================================
            // ADD
            // =================================================

            else {

                url =
                    "https://shalini-mart-production.up.railway.app/api/products";

                method = "POST";

            }


            // =================================================
            // IMPORTANT:
            // CONVERT NUMBER FIELDS TO ACTUAL NUMBERS
            // =================================================

            const requestBody = {

                name: product.name.trim(),

                description:
                    product.description.trim(),

                price:
                    Number(product.price),

                stockQuantity:
                    Number(product.stockQuantity),

                category:
                    product.category.trim(),

                imageUrl:
                    product.imageUrl || "",

                sellerId:
                    Number(sellerId)

            };


            console.log(
                "SENDING PRODUCT:",
                requestBody
            );


            // =================================================
            // REQUEST
            // =================================================

            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(requestBody)
                }
            );


            // =================================================
            // READ RESPONSE
            // =================================================

            const responseText =
                await response.text();


            console.log(
                "BACKEND RESPONSE:",
                response.status,
                responseText
            );


            // =================================================
            // ERROR
            // =================================================

            if (!response.ok) {

                setMessage(
                    responseText ||
                    `Server error (${response.status})`
                );

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            if (editingId !== null) {

                setMessage(
                    "✅ Product updated successfully!"
                );

            } else {

                setMessage(
                    "✅ Product added successfully!"
                );
            }


            // CLEAR FORM

            setProduct({
                ...emptyProduct
            });


            // EXIT EDIT / ADD MODE
            setEditingId(null);
            setShowAddForm(false);

            // CLEAR FILE INPUT

            const fileInput =
                document.getElementById(
                    "productImage"
                );

            if (fileInput) {
                fileInput.value = "";
            }


            // RELOAD PRODUCTS

            await loadProducts();

        } catch (error) {

            console.error(
                "SAVE PRODUCT ERROR:",
                error
            );

            setMessage(
                "Cannot connect to backend: "
                + error.message
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const editProduct = (item) => {

        // OWNERSHIP CHECK

        if (
            Number(item.sellerId)
            !== Number(sellerId)
        ) {

            alert(
                "You can edit only your own product."
            );

            return;
        }


        // LOAD PRODUCT INTO FORM

        setProduct({

            name:
                item.name || "",

            description:
                item.description || "",

            price:
                item.price !== null &&
                item.price !== undefined
                    ? String(item.price)
                    : "",

            stockQuantity:
                item.stockQuantity !== null &&
                item.stockQuantity !== undefined
                    ? String(item.stockQuantity)
                    : "",

            category:
                item.category || "",

            imageUrl:
                item.imageUrl || ""

        });


        setEditingId(item.id);

        setMessage("");


        // SCROLL TO FORM

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });
    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const deleteProduct = async (
        id,
        productSellerId
    ) => {

        if (
            Number(productSellerId)
            !== Number(sellerId)
        ) {

            alert(
                "You can delete only your own product."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setMessage(
                "Deleting product..."
            );


            const response =
                await fetch(

                    `https://shalini-mart-production.up.railway.app/api/products/${id}?sellerId=${sellerId}`,

                    {
                        method: "DELETE"
                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                setMessage(
                    result ||
                    "Unable to delete product."
                );

                return;
            }


            setMessage(
                "✅ Product deleted successfully!"
            );


            await loadProducts();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to delete product: "
                + error.message
            );
        }
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {

        setEditingId(null);
        setShowAddForm(false);

        setProduct({
            ...emptyProduct
        });

        setMessage("");


        const fileInput =
            document.getElementById(
                "productImage"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };


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

                    <h2 style={styles.heading}>
                        🛍️ My Products
                    </h2>

                    <p style={styles.welcome}>
                        Seller:{" "}
                        <strong>
                            {loggedInUser?.username}
                        </strong>
                    </p>

                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>

                    <button
                        style={styles.addProductHeaderBtn}
                        onClick={() =>
                            navigate("/seller/products/add")
                        }
                    >
                        ➕ Add New Product
                    </button>

                    <button
                        style={styles.backButton}
                        onClick={() =>
                            navigate(
                                "/seller-dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

            </div>


            {/* =================================================
                FORM (Shown when Editing or showAddForm is true)
            ================================================= */}

            {(editingId !== null || showAddForm) && (

                <form
                    style={styles.formCard}
                    onSubmit={handleSubmit}
                >

                    <h2 style={styles.formTitle}>

                        {editingId !== null
                            ? "✏️ Edit Product"
                            : "➕ Add New Product"}

                    </h2>


                    <label style={styles.label}>
                        Product Name
                    </label>

                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Example: Premium Watch"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />


                    <label style={styles.label}>
                        Description
                    </label>

                    <textarea
                        style={styles.textarea}
                        name="description"
                        placeholder="Enter product description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />


                    <label style={styles.label}>
                        Price
                    </label>

                    <input
                        style={styles.input}
                        type="number"
                        name="price"
                        placeholder="₹ Price"
                        value={product.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />


                    <label style={styles.label}>
                        Stock Quantity
                    </label>

                    <input
                        style={styles.input}
                        type="number"
                        name="stockQuantity"
                        placeholder="Available quantity"
                        value={product.stockQuantity}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        required
                    />


                    <label style={styles.label}>
                        Category
                    </label>

                    <input
                        style={styles.input}
                        type="text"
                        name="category"
                        placeholder="Example: Watches"
                        value={product.category}
                        onChange={handleChange}
                        required
                    />


                    {/* IMAGE */}

                    <label style={styles.label}>
                        📷 Product Image
                    </label>

                    <input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />


                    {/* IMAGE PREVIEW */}

                    {product.imageUrl && (

                        <div style={styles.previewBox}>

                            <p style={styles.previewText}>
                                Product Image
                            </p>

                            <img
                                src={product.imageUrl}
                                alt="Product Preview"
                                style={styles.previewImage}
                            />

                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        style={styles.submitButton}
                        disabled={loading}
                    >

                        {loading

                            ? "⏳ Saving..."

                            : editingId !== null
                                ? "💾 Update Product"
                                : "➕ Add Product"

                        }

                    </button>


                    {/* CANCEL */}

                    <button
                        type="button"
                        style={styles.cancelButton}
                        onClick={cancelEdit}
                    >
                        Close Form
                    </button>


                    {/* MESSAGE */}

                    {message && (

                        <div style={styles.message}>
                            {message}
                        </div>

                    )}

                </form>

            )}


            {/* =================================================
                GLOBAL MESSAGE (when form is closed)
            ================================================= */}

            {!editingId && !showAddForm && message && (

                <div style={{ ...styles.message, maxWidth: "700px", margin: "0 auto 25px auto" }}>
                    {message}
                </div>

            )}


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <h2 style={styles.productsTitle}>
                🛍️ Your Listed Products
            </h2>


            <div style={styles.productsGrid}>

                {products.length === 0 ? (

                    <p style={styles.empty}>
                        No products available.
                    </p>

                ) : (

                    products.map((item) => (

                        <div
                            key={item.id}
                            style={styles.productCard}
                        >

                            {item.imageUrl ? (

                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={styles.productImage}
                                />

                            ) : (

                                <div style={styles.noImage}>
                                    🖼️
                                    <br />
                                    No Image
                                </div>

                            )}


                            <div style={styles.productInfo}>

                                <h2 style={styles.productName}>
                                    {item.name}
                                </h2>

                                <p style={styles.description}>
                                    {item.description}
                                </p>

                                <p>
                                    <strong>
                                        Price:
                                    </strong>{" "}
                                    <span style={styles.price}>
                                        ₹{item.price}
                                    </span>
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


                                {Number(item.sellerId)
                                    === Number(sellerId) ? (

                                    <>

                                        <p style={styles.owner}>
                                            ✓ Your Product
                                        </p>

                                        <button
                                            type="button"
                                            style={styles.editButton}
                                            onClick={() =>
                                                editProduct(item)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            style={styles.deleteButton}
                                            onClick={() =>
                                                deleteProduct(
                                                    item.id,
                                                    item.sellerId
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </>

                                ) : (

                                    <p style={styles.otherSeller}>
                                        👁️ View Only
                                    </p>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

    page: {
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",
        color: "#172033"
    },

    header: {
        background:
            "linear-gradient(135deg, #172554, #2563eb)",
        color: "white",
        padding: "25px",
        borderRadius: "18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.15)"
    },

    logo: {
        margin: "0 0 5px 0",
        fontSize: "30px"
    },

    heading: {
        margin: "5px 0",
        fontSize: "24px"
    },

    welcome: {
        margin: "8px 0 0",
        fontSize: "16px"
    },

    addProductHeaderBtn: {
        backgroundColor: "#22c55e",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
    },

    backButton: {
        backgroundColor: "white",
        color: "#1d4ed8",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    formCard: {
        maxWidth: "700px",
        margin: "0 auto 40px",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "18px",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.12)"
    },

    formTitle: {
        color: "#172554",
        marginBottom: "25px"
    },

    label: {
        display: "block",
        fontWeight: "bold",
        color: "#172033",
        marginTop: "15px",
        marginBottom: "7px"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "15px"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        minHeight: "100px",
        padding: "13px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "15px",
        resize: "vertical"
    },

    fileInput: {
        width: "100%",
        padding: "12px",
        border: "2px dashed #2563eb",
        borderRadius: "8px",
        boxSizing: "border-box",
        backgroundColor: "#eff6ff",
        cursor: "pointer"
    },

    previewBox: {
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f8fafc",
        borderRadius: "10px",
        textAlign: "center"
    },

    previewText: {
        fontWeight: "bold",
        color: "#172554"
    },

    previewImage: {
        width: "200px",
        height: "200px",
        objectFit: "contain",
        borderRadius: "12px",
        border: "1px solid #cbd5e1"
    },

    submitButton: {
        marginTop: "25px",
        width: "100%",
        padding: "14px",
        background:
            "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    cancelButton: {
        marginTop: "10px",
        width: "100%",
        padding: "12px",
        backgroundColor: "#64748b",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    message: {
        marginTop: "15px",
        padding: "12px",
        backgroundColor: "#eff6ff",
        color: "#172554",
        borderRadius: "8px",
        textAlign: "center",
        fontWeight: "bold"
    },

    productsTitle: {
        textAlign: "center",
        color: "#172554",
        marginBottom: "25px"
    },

    productsGrid: {
        maxWidth: "1100px",
        margin: "auto",
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px"
    },

    productCard: {
        backgroundColor: "white",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.12)"
    },

    productImage: {
        width: "100%",
        height: "230px",
        objectFit: "contain",
        backgroundColor: "#f8fafc"
    },

    noImage: {
        height: "230px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f1f5f9",
        color: "#64748b",
        fontSize: "18px"
    },

    productInfo: {
        padding: "20px"
    },

    productName: {
        color: "#172554",
        marginTop: "0"
    },

    description: {
        color: "#475569",
        lineHeight: "1.5"
    },

    price: {
        color: "#15803d",
        fontWeight: "bold",
        fontSize: "18px"
    },

    owner: {
        color: "#15803d",
        fontWeight: "bold"
    },

    otherSeller: {
        color: "#64748b",
        fontWeight: "bold"
    },

    editButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        marginRight: "8px"
    },

    deleteButton: {
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    empty: {
        textAlign: "center",
        color: "#64748b"
    }
};

export default SellerProducts;