// Import the DNS module to configure DNS settings
const dns = require('dns');
// Set custom DNS servers and prioritize IPv4 addresses
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

// Load environment variables from the .env file
require('dotenv').config();
// Import the Express framework for building the server
const express = require('express');
// Import middleware for security, logging, and cross-origin requests
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// Import the database connection function
const connectDB = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/User');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/Cart'); 
const orderRoutes = require('./routes/Order');
const flashSaleRoutes = require('./routes/flashSale');

// Connect to the MongoDB database
connectDB();

// Create an Express application instance
const app = express();
// Use security-related middleware
app.use(helmet());
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
// Log HTTP requests to the console
app.use(morgan('dev'));

// Register API routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/cart', cartRoutes); // Cart routes
app.use('/api/orders', orderRoutes); // Order routes
app.use('/api/flashsale', flashSaleRoutes); // Flash sale routes

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: 'Something went wrong' }); // Return a generic error response
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));