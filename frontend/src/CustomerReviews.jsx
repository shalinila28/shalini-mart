import React, { useEffect, useState } from "react";

function CustomerReviews({ productId }) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    const customerId =
        loggedInUser?.id;

    const customerName =
        loggedInUser?.username || "Customer";


    const [reviews, setReviews] =
        useState([]);

    const [rating, setRating] =
        useState(5);

    const [comment, setComment] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] =
        useState("");


    // =========================================
    // LOAD REVIEWS
    // =========================================

    useEffect(() => {

        loadReviews();

    }, [productId]);


    const loadReviews = async () => {

        try {

            const response =
                await fetch(
                    `https://shalini-mart-production.up.railway.app/api/reviews/product/${productId}`
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load reviews"
                );
            }

            const data =
                await response.json();

            setReviews(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load reviews."
            );
        }
    };


    // =========================================
    // SUBMIT REVIEW
    // =========================================

    const submitReview = async () => {

        if (!customerId) {

            setMessage(
                "Please login as a customer."
            );

            return;
        }


        if (!comment.trim()) {

            setMessage(
                "Please enter your review."
            );

            return;
        }


        try {

            let response;


            // =====================================
            // UPDATE
            // =====================================

            if (editingId !== null) {

                response =
                    await fetch(

                        `https://shalini-mart-production.up.railway.app/api/reviews/${editingId}?customerId=${customerId}`,

                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    rating:
                                        Number(rating),

                                    comment:
                                        comment

                                })
                        }
                    );

            }


            // =====================================
            // ADD
            // =====================================

            else {

                response =
                    await fetch(

                        "https://shalini-mart-production.up.railway.app/api/reviews",

                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    productId:
                                        productId,

                                    customerId:
                                        customerId,

                                    customerName:
                                        customerName,

                                    rating:
                                        Number(rating),

                                    comment:
                                        comment

                                })
                        }
                    );
            }


            const result =
                await response.text();


            if (!response.ok) {

                setMessage(result);

                return;
            }


            setMessage(
                editingId !== null
                    ? "Review updated successfully! ⭐"
                    : "Review added successfully! ⭐"
            );


            setRating(5);

            setComment("");

            setEditingId(null);


            loadReviews();

        } catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend."
            );
        }
    };


    // =========================================
    // EDIT OWN REVIEW
    // =========================================

    const editReview = (review) => {

        // Extra frontend safety check

        if (
            review.customerId !==
            customerId
        ) {

            alert(
                "You can edit only your own review."
            );

            return;
        }


        setEditingId(review.id);

        setRating(review.rating);

        setComment(review.comment);

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================================
    // DELETE OWN REVIEW
    // =========================================

    const deleteReview = async (review) => {

        // Extra frontend safety check

        if (
            review.customerId !==
            customerId
        ) {

            alert(
                "You can delete only your own review."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Delete your review?"
            );


        if (!confirmed) {

            return;
        }


        try {

            const response =
                await fetch(

                    `https://shalini-mart-production.up.railway.app/api/reviews/${review.id}?customerId=${customerId}`,

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
                "Your review was deleted."
            );


            loadReviews();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to delete review."
            );
        }
    };


    // =========================================
    // CANCEL EDIT
    // =========================================

    const cancelEdit = () => {

        setEditingId(null);

        setRating(5);

        setComment("");

        setMessage("");
    };


    // =========================================
    // UI
    // =========================================

    return (

        <div style={styles.container}>

            <h2 style={styles.title}>
                ⭐ Customer Reviews
            </h2>


            {/* ==================================
                REVIEW FORM
            ================================== */}

            {customerId && (

                <div style={styles.form}>

                    <h3 style={styles.formTitle}>

                        {editingId !== null
                            ? "✏️ Edit Your Review"
                            : "⭐ Give Your Review"}

                    </h3>


                    <label style={styles.label}>
                        Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(
                                Number(e.target.value)
                            )
                        }
                        style={styles.input}
                    >

                        <option value="5">
                            ⭐⭐⭐⭐⭐ 5
                        </option>

                        <option value="4">
                            ⭐⭐⭐⭐ 4
                        </option>

                        <option value="3">
                            ⭐⭐⭐ 3
                        </option>

                        <option value="2">
                            ⭐⭐ 2
                        </option>

                        <option value="1">
                            ⭐ 1
                        </option>

                    </select>


                    <label style={styles.label}>
                        Your Review
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) =>
                            setComment(
                                e.target.value
                            )
                        }
                        placeholder="Write your review..."
                        style={styles.textarea}
                    />


                    <button
                        onClick={submitReview}
                        style={styles.submitButton}
                    >

                        {editingId !== null
                            ? "💾 Update Review"
                            : "⭐ Submit Review"}

                    </button>


                    {editingId !== null && (

                        <button
                            onClick={cancelEdit}
                            style={styles.cancelButton}
                        >
                            Cancel Edit
                        </button>

                    )}

                </div>

            )}


            {/* ==================================
                MESSAGE
            ================================== */}

            {message && (

                <div style={styles.message}>
                    {message}
                </div>

            )}


            {/* ==================================
                REVIEWS
            ================================== */}

            <div style={styles.reviewList}>

                {reviews.length === 0 ? (

                    <div style={styles.noReviews}>
                        No reviews yet. Be the first to review! ⭐
                    </div>

                ) : (

                    reviews.map((review) => {

                        const isOwnReview =
                            review.customerId ===
                            customerId;


                        return (

                            <div
                                key={review.id}
                                style={
                                    isOwnReview
                                        ? styles.ownReview
                                        : styles.reviewCard
                                }
                            >

                                <div
                                    style={
                                        styles.reviewHeader
                                    }
                                >

                                    <strong
                                        style={
                                            styles.customerName
                                        }
                                    >
                                        👤{" "}
                                        {review.customerName}
                                    </strong>


                                    {isOwnReview && (

                                        <span
                                            style={
                                                styles.youBadge
                                            }
                                        >
                                            YOUR REVIEW
                                        </span>

                                    )}

                                </div>


                                <div
                                    style={
                                        styles.rating
                                    }
                                >

                                    {"⭐".repeat(
                                        review.rating
                                    )}

                                </div>


                                <p
                                    style={
                                        styles.comment
                                    }
                                >
                                    {review.comment}
                                </p>


                                {/* ==========================
                                    ONLY OWNER CAN EDIT/DELETE
                                ========================== */}

                                {isOwnReview ? (

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
                                            ✏️ Edit
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
                                            🗑️ Delete
                                        </button>

                                    </div>

                                ) : (

                                    <div
                                        style={
                                            styles.viewOnly
                                        }
                                    >
                                        👁️ View Only
                                    </div>

                                )}

                            </div>

                        );

                    })

                )}

            </div>

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

    container: {
        maxWidth: "900px",
        margin: "40px auto",
        padding: "25px",
        fontFamily: "Arial, sans-serif"
    },

    title: {
        textAlign: "center",
        color: "#172554",
        marginBottom: "25px"
    },

    form: {
        background:
            "linear-gradient(135deg, #eff6ff, #ffffff)",
        padding: "25px",
        borderRadius: "18px",
        boxShadow:
            "0 8px 25px rgba(0,0,0,0.12)",
        marginBottom: "25px"
    },

    formTitle: {
        color: "#1e3a8a"
    },

    label: {
        display: "block",
        marginTop: "15px",
        marginBottom: "7px",
        fontWeight: "bold",
        color: "#172033"
    },

    input: {
        width: "100%",
        padding: "12px",
        boxSizing: "border-box",
        border: "1px solid #94a3b8",
        borderRadius: "8px",
        fontSize: "15px"
    },

    textarea: {
        width: "100%",
        minHeight: "100px",
        padding: "12px",
        boxSizing: "border-box",
        border: "1px solid #94a3b8",
        borderRadius: "8px",
        fontSize: "15px",
        resize: "vertical"
    },

    submitButton: {
        width: "100%",
        marginTop: "20px",
        padding: "14px",
        background:
            "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px"
    },

    cancelButton: {
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        background: "#64748b",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer"
    },

    message: {
        padding: "12px",
        marginBottom: "20px",
        background: "#dbeafe",
        color: "#172554",
        borderRadius: "10px",
        textAlign: "center",
        fontWeight: "bold"
    },

    reviewList: {
        display: "flex",
        flexDirection: "column",
        gap: "18px"
    },

    reviewCard: {
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.10)",
        border: "1px solid #e2e8f0"
    },

    ownReview: {
        background:
            "linear-gradient(135deg, #ecfdf5, #ffffff)",
        padding: "20px",
        borderRadius: "15px",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.12)",
        border:
            "2px solid #22c55e"
    },

    reviewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px"
    },

    customerName: {
        color: "#172033",
        fontSize: "17px"
    },

    youBadge: {
        background: "#16a34a",
        color: "white",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "bold"
    },

    rating: {
        marginTop: "10px",
        fontSize: "18px"
    },

    comment: {
        color: "#334155",
        lineHeight: "1.6",
        fontSize: "15px"
    },

    editButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "9px 15px",
        borderRadius: "8px",
        marginRight: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    deleteButton: {
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "9px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    viewOnly: {
        color: "#64748b",
        fontWeight: "bold",
        fontSize: "14px"
    },

    noReviews: {
        textAlign: "center",
        padding: "30px",
        color: "#64748b",
        background: "#f8fafc",
        borderRadius: "12px"
    }
};

export default CustomerReviews;