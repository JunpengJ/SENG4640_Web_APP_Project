// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB atlas connected');
    } catch (err) {
        // Log any connection errors and exit the process with a failure code
        console.error('Connection error: ', err);
        process.exit(1);
    }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;