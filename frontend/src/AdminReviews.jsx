import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function AdminReviews() {

    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
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

        const user =
            JSON.parse(savedUser);

        if (
            !user.role ||
            user.role.toUpperCase() !== "ADMIN"
        ) {
            navigate("/");
            return;
        }

        loadReviews();

    }, [navigate]);


    // =====================================================
    // LOAD REVIEWS
    // =====================================================

    const loadReviews = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/admin/reviews`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load reviews"
                );
            }

            const data =
                await response.json();

            setReviews(data);
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
    // DELETE REVIEW
    // =====================================================

    const deleteReview = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );

        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/admin/reviews/${id}`,
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

            loadReviews();

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend!"
            );
        }
    };


    // =====================================================
    // STAR DISPLAY
    // =====================================================

    const showStars = (rating) => {

        const number =
            Number(rating) || 0;

        return (
            "⭐".repeat(number)
            + "☆".repeat(5 - number)
        );
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
                        ⭐ Manage Reviews
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


            {/* REVIEWS */}

            {loading ? (

                <h2>
                    Loading reviews...
                </h2>

            ) : reviews.length === 0 ? (

                <h2>
                    No reviews found.
                </h2>

            ) : (

                <>

                    <h2>
                        All Customer Reviews
                    </h2>


                    {reviews.map((review) => (

                        <div
                            key={review.id}
                            style={styles.reviewCard}
                        >

                            <h2>
                                ⭐ Review #{review.id}
                            </h2>


                            <p>
                                <strong>
                                    Customer ID:
                                </strong>{" "}
                                {review.customerId}
                            </p>


                            <p>
                                <strong>
                                    Product ID:
                                </strong>{" "}
                                {review.productId}
                            </p>


                            <p>
                                <strong>
                                    Rating:
                                </strong>{" "}

                                <span
                                    style={
                                        styles.stars
                                    }
                                >
                                    {showStars(
                                        review.rating
                                    )}
                                </span>

                                {" "}
                                ({review.rating}/5)

                            </p>


                            <p>
                                <strong>
                                    Comment:
                                </strong>
                            </p>


                            <p style={styles.comment}>
                                {review.comment ||
                                    "No comment"}
                            </p>


                            <button
                                style={
                                    styles.deleteButton
                                }
                                onClick={() =>
                                    deleteReview(
                                        review.id
                                    )
                                }
                            >
                                🗑️ Delete Review
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

    reviewCard: {
        backgroundColor: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    stars: {
        fontSize: "20px"
    },

    comment: {
        backgroundColor: "#f5f5f5",
        padding: "15px",
        borderRadius: "6px"
    },

    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer"
    }

};

export default AdminReviews;