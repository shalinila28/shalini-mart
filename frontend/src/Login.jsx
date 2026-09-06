import React, { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            // =====================================
            // LOGIN FAILED
            // =====================================

            if (!response.ok || typeof data === "string") {

                setMessage(
                    typeof data === "string"
                        ? data
                        : "Invalid Email or Password"
                );

                return;
            }


            // =====================================
            // SAVE LOGGED-IN USER
            // =====================================

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data)
            );


            // =====================================
            // CHECK ROLE
            // =====================================

            if (data.role === "CUSTOMER") {

                window.location.href = "/customer";

            } else if (data.role === "SELLER") {

                window.location.href = "/seller";

            } else if (data.role === "ADMIN") {

                window.location.href = "/admin";

            } else {

                setMessage("Invalid user role.");
            }

        } catch (error) {

            console.error(error);

            setMessage(
                "Cannot connect to backend."
            );
        }
    };


    return (

        <div>

            <h1>ShaliniMart Login</h1>

            <form onSubmit={handleLogin}>

                <div>

                    <label>Email</label>

                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />

                </div>

                <br />


                <div>

                    <label>Password</label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        required
                    />

                </div>


                <br />


                <button type="submit">
                    Login
                </button>

            </form>


            {message && (

                <p>
                    {message}
                </p>

            )}

        </div>
    );
}

export default Login;