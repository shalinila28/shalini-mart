import React, { useState } from "react";

function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");

    const handleRegister = async (e) => {

        e.preventDefault();

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

            if (response.ok) {

                alert("Registration successful!");

                setUsername("");
                setEmail("");
                setPassword("");
                setRole("CUSTOMER");

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

            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Username</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />
                </div>


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


                <div>

                    <label>Role</label>

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


                <button type="submit">
                    Register
                </button>

            </form>

        </div>
    );
}

export default Register;