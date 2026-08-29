import React, { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

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

            if (response.ok) {

                alert("Login successful!");

                console.log("Logged in user:", data);

                // Role checking
                if (data.role === "ADMIN") {

                    console.log("Open Admin Dashboard");

                } else if (data.role === "SELLER") {

                    console.log("Open Seller Dashboard");

                } else if (data.role === "CUSTOMER") {

                    console.log("Open Customer Dashboard");
                }

            } else {

                alert(data);
            }

        } catch (error) {

            console.error(error);

            alert("Cannot connect to backend");
        }
    };


    return (

        <div>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>

                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                </div>


                <div>

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                </div>


                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;