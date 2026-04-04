// Import the express library to create a router
const express = require('express');
// Import bcrypt for password hashing
const bcrypt = require('bcryptjs');
// Import JSON Web Token for authentication
const jwt = require('jsonwebtoken');
// Import the User model
const User = require('../models/User');
// Import the authentication middleware
const { auth } = require('../middleware/auth');

// Create a new router instance
const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, profile } = req.body; // Extract user details from the request body
        const existing = await User.findOne({ email }); // Check if the email is already registered
        if (existing) return res.status(400).json({ error: 'Email already exists' }); // Return an error if the email is taken
        
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({
          email,
          password: hashedPassword,
          profile: profile || {} // Set default profile if not provided
        }); // Create a new user instance
        await user.save(); // Save the user to the database
      
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate a JWT token
        res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, profile: user.profile } }); // Return the token and user details
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to log in a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Extract email and password from the request body
        const user = await User.findOne({ email }); // Find the user by email
        if (!user) return res.status(401).json({ error: 'Invalid credentials' }); // Return an error if the user does not exist
        
        const isMatch = await user.comparePassword(password); // Compare the provided password with the stored hashed password
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' }); // Return an error if the passwords do not match
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate a JWT token
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, profile: user.profile } }); // Return the token and user details
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to get the authenticated user's details
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Find the user by ID and exclude the password field
        res.json({ user }); // Return the user details
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Route to update the authenticated user's details
router.put('/me', auth, async (req, res) => {
    try {
        const allowedUpdates = ['profile.firstName', 'profile.lastName', 'profile.phone', 'addresses']; // Define allowed fields for update
        const updates = {};
        for (const key of allowedUpdates) {
          if (req.body[key] !== undefined) updates[key] = req.body[key]; // Collect updates from the request body
        }
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password'); // Update the user details
        res.json({ user }); // Return the updated user details
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

// Export the router for use in other parts of the application
module.exports = router;