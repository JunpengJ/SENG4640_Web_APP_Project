import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState(''); // State to store the email input
    const [password, setPassword] = useState(''); // State to store the password input
    const [error, setError] = useState(''); // State to store error messages
    const { login } = useAuth(); // Get the login function from the AuthContext
    const navigate = useNavigate(); // Hook to navigate between routes

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await login(email, password); // Attempt to log in with the provided credentials
            navigate('/'); // Navigate to the home page on successful login
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed'); // Set error message if login fails
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Login</h2>
            {error && <div className="auth-error">{error}</div>} {/* Display error message if any */}
            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <div className="auth-link">
                Don't have an account? <Link to="/register">Register</Link> {/* Link to the registration page */}
            </div>
        </div>
    );
}

// Export the Login component for use in other parts of the application
export default Login;