import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [email, setEmail] = useState(''); // State to store the email input
    const [password, setPassword] = useState(''); // State to store the password input
    const [error, setError] = useState(''); // State to store error messages
    const { register } = useAuth(); // Get the register function from the AuthContext
    const navigate = useNavigate(); // Hook to navigate between routes

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await register({ email, password }); // Attempt to register with the provided credentials
            navigate('/'); // Navigate to the home page on successful registration
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed'); // Set error message if registration fails
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Register</h2>
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
                <button type="submit">Register</button>
            </form>
            <div className="auth-link">
                Already have an account? <Link to="/login">Login</Link> {/* Link to the login page */}
            </div>
        </div>
    );
}

// Export the Register component for use in other parts of the application
export default Register;