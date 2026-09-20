import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {

    const navigate = useNavigate();

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));


    const [product, setProduct] = useState({

        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "",
        imageUrl: ""

    });


    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // ==============================
    // LOGIN CHECK
    // ==============================

    if (!loggedInUser ||
        loggedInUser.role !== "SELLER") {

        navigate("/login");

        return null;
    }


    // ==============================
    // HANDLE INPUT
    // ==============================

    const handleChange = (e) => {

        setProduct({

            ...product,

            [e.target.name]: e.target.value

        });

    };


    // ==============================
    // ADD PRODUCT
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8080/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        sellerId: loggedInUser.id,

                        name: product.name,

                        description:
                            product.description,

                        price:
                            Number(product.price),

                        stockQuantity:
                            Number(product.stockQuantity),

                        category:
                            product.category,

                        imageUrl:
                            product.imageUrl

                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to add product"
                );

            }


            setMessage(
                "Product added successfully!"
            );


            setProduct({

                name: "",
                description: "",
                price: "",
                stockQuantity: "",
                category: "",
                imageUrl: ""

            });


        }
        catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend."
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div style={styles.page}>

            <div style={styles.container}>

                <button
                    style={styles.back}
                    onClick={() =>
                        navigate("/seller")
                    }
                >
                    ← Back to Seller Dashboard
                </button>


                <h1 style={styles.heading}>
                    ➕ Add New Product
                </h1>


                <p style={styles.subheading}>
                    Add your product to ShaliniMart
                </p>


                {message && (

                    <div style={styles.message}>
                        {message}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    style={styles.form}
                >

                    <label>
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                    />


                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        required
                    />


                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="0"
                        required
                    />


                    <label>
                        Stock Quantity
                    </label>

                    <input
                        type="number"
                        name="stockQuantity"
                        value={product.stockQuantity}
                        onChange={handleChange}
                        placeholder="Enter stock quantity"
                        min="0"
                        required
                    />


                    <label>
                        Category
                    </label>

                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        placeholder="Example: Electronics"
                        required
                    />


                    <label>
                        Image URL
                    </label>

                    <input
                        type="text"
                        name="imageUrl"
                        value={product.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                    />


                    <button
                        type="submit"
                        style={styles.submit}
                        disabled={loading}
                    >

                        {loading
                            ? "Adding..."
                            : "Add Product"}

                    </button>

                </form>

            </div>

        </div>
    );
}


const styles = {

    page: {

        minHeight: "100vh",

        padding: "30px",

        background:
            "linear-gradient(135deg,#eef2ff,#f8fafc)",

        fontFamily: "Arial"

    },


    container: {

        maxWidth: "650px",

        margin: "auto",

        backgroundColor: "white",

        padding: "35px",

        borderRadius: "20px",

        boxShadow:
            "0 10px 30px rgba(0,0,0,0.12)"

    },


    back: {

        border: "none",

        background: "transparent",

        color: "#4f46e5",

        fontWeight: "bold",

        cursor: "pointer",

        fontSize: "15px"

    },


    heading: {

        color: "#172554",

        textAlign: "center",

        marginTop: "25px"

    },


    subheading: {

        textAlign: "center",

        color: "#64748b"

    },


    message: {

        backgroundColor: "#dcfce7",

        color: "#166534",

        padding: "12px",

        borderRadius: "8px",

        marginTop: "20px",

        textAlign: "center"

    },


    form: {

        display: "flex",

        flexDirection: "column",

        gap: "10px",

        marginTop: "25px"

    },


    submit: {

        marginTop: "15px",

        padding: "14px",

        backgroundColor: "#4f46e5",

        color: "white",

        border: "none",

        borderRadius: "10px",

        fontSize: "16px",

        fontWeight: "bold",

        cursor: "pointer"

    }

};

export default AddProduct;