import React from "react";

function Home() {

    const goToRegister = () => {
        window.location.href = "/register";
    };

    const goToLogin = () => {
        window.location.href = "/login";
    };

    return (

        <div>

            <h1>Welcome to ShaliniMart</h1>

            <p>
                Your Online Shopping Platform
            </p>

            <br />

            <button onClick={goToRegister}>
                Create Account
            </button>

            {" "}

            <button onClick={goToLogin}>
                Login
            </button>

        </div>
    );
}

export default Home;