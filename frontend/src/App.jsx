import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import CustomerDashboard from "./CustomerDashboard";
import SellerDashboard from "./SellerDashboard";
import Cart from "./Cart";
import AdminDashboard from "./AdminDashboard";

function App() {

    const path = window.location.pathname;


    // =====================================
    // HOME PAGE
    // =====================================

    if (path === "/") {
        return <Home />;
    }


    // =====================================
    // REGISTER
    // =====================================

    if (path === "/register") {
        return <Register />;
    }


    // =====================================
    // LOGIN
    // =====================================

    if (path === "/login") {
        return <Login />;
    }


    // =====================================
    // CUSTOMER DASHBOARD
    // =====================================

    if (path === "/customer") {
        return <CustomerDashboard />;
    }


    // =====================================
    // SELLER DASHBOARD
    // =====================================

    if (path === "/seller") {
        return <SellerDashboard />;
    }


    // =====================================
    // CART
    // =====================================

    if (path === "/cart") {
        return <Cart />;
    }


    // =====================================
    // ADMIN DASHBOARD
    // =====================================

    if (path === "/admin") {
        return <AdminDashboard />;
    }


    // =====================================
    // UNKNOWN URL
    // =====================================

    return <Home />;
}

export default App;