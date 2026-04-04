// Import the JSON Web Token library for token verification
const jwt = require('jsonwebtoken');
// Import the User model to fetch user details from the database
const User = require('../models/User');

// Middleware to authenticate users based on the provided token
const auth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            // If no token is provided, throw an error
            throw new Error();
        }
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user associated with the token
        const user = await User.findById(decoded.id);
        if (!user) throw new Error();
        // Attach the user object to the request for further use
        req.user = user;
        next();
    } catch (error) {
        // Respond with an authentication error if token verification fails
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

// Middleware to authorize users based on their roles
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied'});
        }
        next();
    };
};

// Export the authentication and authorization middleware functions
module.exports = { auth, authorize };