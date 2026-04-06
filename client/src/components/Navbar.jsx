import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); // Get the current authenticated user and logout function

  return (
    <div className="nav">
        <h2>Home</h2>
        <div>
            {/* Navigation links */}
            <Link to="/">Home</Link>
            <Link to="/flash-sale">Flash Sale</Link>
            <Link to="/cart">Cart</Link>
            {user && <Link to="/orders">My Orders</Link>}
            {user ? (
                <>
                  {/* Display user email and logout button if authenticated */}
                  <span style={{ marginLeft: '1rem' }}>Hello, {user.email}</span>
                  <button onClick={logout} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
                </>
            ) : (
                <>
                  {/* Display login and register links if not authenticated */}
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
            )}
        </div>
    </div>
  );
}

// Export the Navbar component for use in other parts of the application
export default Navbar;