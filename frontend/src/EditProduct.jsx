import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

function EditProduct() {

    const navigate = useNavigate();

    const { id } = useParams();

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


    // ==============================
    // LOAD PRODUCT
    // ==============================

    useEffect(() => {

        fetch(
            "http://localhost:8080/api/products"
        )

            .then(response =>
                response.json()
            )

            .then(data => {

                const found =
                    data.find(
                        item =>
                            item.id === Number(id)
                    );


                if (!found) {

                    setMessage(
                        "Product not found."
                    );

                    return;
                }


                if (
                    found.sellerId !==
                    sellerId
                ) {

                    setMessage(
                        "You can edit only your own product."
                    );

                    return;
                }


                setProduct({

                    name: found.name,

                    description:
                        found.description,

                    price: found.price,

                    stockQuantity:
                        found.stockQuantity,

                    category:
                        found.category,

                    imageUrl:
                        found.imageUrl || ""

                });

            })

            .catch(error => {

                console.error(error);

                setMessage(
                    "Cannot load product."
                );

            });

    }, [id, sellerId]);


    // ==============================
    // INPUT
    // ==============================

    const handleChange = (e) => {

        setProduct({

            ...product,

            [e.target.name]:
                e.target.value

        });
    };


    // ==============================
    // UPDATE
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            const response = await fetch(

                `http://localhost:8080/api/products/${id}?sellerId=${sellerId}`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(product)
                }
            );


            const result =
                await response.text();


            if (!response.ok) {

                setMessage(result);

                return;
            }


            alert(
                "Product updated successfully!"
            );


            navigate("/seller-products");

        } catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend!"
            );
        }
    };


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

            </div>
        );
    }


    return (

        <div style={styles.container}>

            <button
                style={styles.backButton}
                onClick={() =>
                    navigate("/seller-products")
                }
            >
                ← My Products
            </button>


            <div style={styles.formBox}>

                <h1>
                    ✏️ Edit Product
                </h1>


                <form onSubmit={handleSubmit}>

                    <input
                        style={styles.input}
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                    />


                    <textarea
                        style={styles.textarea}
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                    />


                    <input
                        style={styles.input}
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="Price"
                        min="0"
                        required
                    />


                    <input
                        style={styles.input}
                        type="number"
                        name="stockQuantity"
                        value={product.stockQuantity}
                        onChange={handleChange}
                        placeholder="Stock"
                        min="0"
                        required
                    />


                    <input
                        style={styles.input}
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                    />


                    <input
                        style={styles.input}
                        name="imageUrl"
                        value={product.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                    />


                    <button
                        style={styles.updateButton}
                        type="submit"
                    >
                        Update Product
                    </button>

                </form>


                {message && (

                    <p>
                        {message}
                    </p>

                )}

            </div>

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

    formBox: {
        maxWidth: "600px",
        backgroundColor: "white",
        padding: "30px",
        margin: "30px auto",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        boxSizing: "border-box"
    },

    textarea: {
        width: "100%",
        minHeight: "100px",
        padding: "12px",
        marginBottom: "15px",
        boxSizing: "border-box"
    },

    updateButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "5px",
        cursor: "pointer"
    },

    backButton: {
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer"
    },

    center: {
        textAlign: "center",
        padding: "50px"
    }

};

export default EditProduct;