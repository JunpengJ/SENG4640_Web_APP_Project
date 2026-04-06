import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getProfile } from '../api';

const AuthContext = createContext(); // Create a context for authentication

export const useAuth = () => useContext(AuthContext); // Custom hook to use the AuthContext

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store the authenticated user
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (token) {
            getProfile()
                .then((res) => setUser(res.data.user)) // Set user data if token is valid
                .catch(() => {
                  localStorage.removeItem('token'); // Remove invalid token
                  setUser(null);
                })
                .finally(() => setLoading(false)); // Set loading to false after fetching profile
        } else {
            setLoading(false); // Set loading to false if no token is found
        }
    }, []);

    const login = async (email, password) => {
        const res = await loginApi(email, password); // Call login API
        localStorage.setItem('token', res.data.token); // Store token in local storage
        setUser(res.data.user); // Set user data
        return res.data;
    };

    const register = async (userData) => {
        const res = await registerApi(userData); // Call register API
        localStorage.setItem('token', res.data.token); // Store token in local storage
        setUser(res.data.user); // Set user data
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        setUser(null); // Clear user data
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children} {/* Render child components */}
        </AuthContext.Provider>
    );
};