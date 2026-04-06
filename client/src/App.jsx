import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FlashSale from './pages/FlashSale';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
    const { user, loading } = useAuth(); // Get the current authenticated user and loading status

    if (loading) return <div className="loading">Loading...</div>; // Display loading message while fetching user data

    return (
        <div>
            <Navbar /> {/* Render the navigation bar */}
            <Routes>
                <Route path="/" element={<Home />} /> {/* Route for the home page */}
                <Route path="/flash-sale" element={<FlashSale />} /> {/* Route for the flash sale page */}
                <Route path="/cart" element={<Cart />} /> {/* Route for the cart page */}
                <Route path="/orders" element={user ? <OrderHistory /> : <Navigate to="/login" />} /> {/* Protected route for order history */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} /> {/* Route for login page */}
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} /> {/* Route for registration page */}
                <Route path="/admin" element={ user && (user.role === 'superAdmin' || user.role === 'productManager') ? <AdminDashboard /> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}

// Export the App component for use in other parts of the application
export default App;