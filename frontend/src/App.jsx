import React, { useState } from "react";

import Login from "./Login";
import Register from "./Register";

function App() {

    const [page, setPage] = useState("login");

    return (

        <div>

            <h1>ShaliniMart</h1>

            <button onClick={() => setPage("login")}>
                Login
            </button>

            <button onClick={() => setPage("register")}>
                Create Account
            </button>


            {page === "login" && <Login />}

            {page === "register" && <Register />}

        </div>
    );
}

export default App;