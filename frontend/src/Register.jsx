import React, { useState } from "react";

function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();
        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                        role: role
                    })
                }
            );

            const data = await response.text();

            setMessage(data);

            if (response.ok &&
                data === "Registration Successful!") {

                setUsername("");
                setEmail("");
                setPassword("");
                setRole("CUSTOMER");
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

            <h1>ShaliniMart</h1>

            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>

                {/* USERNAME */}

                <div>

                    <label>
                        Username
                    </label>

                    <br />

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        placeholder="Enter username"
                        required
                    />

                </div>

                <br />


                {/* EMAIL */}

                <div>

                    <label>
                        Email
                    </label>

                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        required
                    />

                </div>

                <br />


                {/* PASSWORD */}

                <div>

                    <label>
                        Password
                    </label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />

                </div>

                <br />


                {/* ROLE */}

                <div>

                    <label>
                        Select Role
                    </label>

                    <br />

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    >

                        <option value="CUSTOMER">
                            Customer
                        </option>

                        <option value="SELLER">
                            Seller
                        </option>

                    </select>

                </div>

                <br />


                <button type="submit">
                    Register
                </button>

            </form>


            <br />


            {message && (

                <p>
                    {message}
                </p>

            )}


            <p>
                Already have an account?
            </p>

            <button
                onClick={() =>
                    window.location.href = "/login"
                }
            >
                Go to Login
            </button>

        </div>
    );
}

export default Register;