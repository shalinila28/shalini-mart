import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");


    useEffect(() => {

        checkAdmin();

    }, []);


    const checkAdmin = () => {

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

        loadUsers();
    };


    const loadUsers = async () => {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/admin/users`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load users"
                );
            }

            const data =
                await response.json();

            setUsers(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend!"
            );

        } finally {

            setLoading(false);
        }
    };


    const deleteUser = async (
        id,
        role
    ) => {

        if (
            role &&
            role.toUpperCase() === "ADMIN"
        ) {

            alert(
                "Admin account cannot be deleted!"
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/admin/users/${id}`,
                {
                    method: "DELETE"
                }
            );


            const result =
                await response.text();


            alert(result);

            if (response.ok) {
                loadUsers();
            }

        } catch (error) {

            console.error(error);

            alert(
                "Cannot connect to backend!"
            );
        }
    };


    return (

        <div style={styles.container}>

            <div style={styles.header}>

                <h1>
                    👥 Manage Users
                </h1>

                <button
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                    style={styles.back}
                >
                    ← Dashboard
                </button>

            </div>


            {message && (
                <div style={styles.message}>
                    {message}
                </div>
            )}


            {loading ? (

                <h2>
                    Loading users...
                </h2>

            ) : users.length === 0 ? (

                <h2>
                    No users found.
                </h2>

            ) : (

                users.map((user) => (

                    <div
                        key={user.id}
                        style={styles.userCard}
                    >

                        <div>

                            <h2>
                                👤 {user.username}
                            </h2>

                            <p>
                                <strong>
                                    ID:
                                </strong>{" "}
                                {user.id}
                            </p>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {user.email}
                            </p>

                            <p>
                                <strong>
                                    Role:
                                </strong>{" "}
                                {user.role}
                            </p>

                        </div>


                        {user.role &&
                        user.role.toUpperCase()
                            === "ADMIN" ? (

                            <button
                                disabled
                                style={
                                    styles.protected
                                }
                            >
                                🔐 Admin Protected
                            </button>

                        ) : (

                            <button
                                style={
                                    styles.delete
                                }
                                onClick={() =>
                                    deleteUser(
                                        user.id,
                                        user.role
                                    )
                                }
                            >
                                🗑️ Delete
                            </button>

                        )}

                    </div>

                ))

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
        marginBottom: "25px"
    },

    back: {
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

    userCard: {
        backgroundColor: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
    },

    delete: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    protected: {
        backgroundColor: "#777",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px"
    }

};

export default AdminUsers;