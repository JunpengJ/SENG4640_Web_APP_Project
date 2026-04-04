// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');
// Import the bcrypt library for password hashing
const bcrypt = require('bcrypt');

// Define the schema for users
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // User's email address (must be unique)
    password: { type: String, required: true }, // Hashed password of the user
    role: { type: String, enum: ['customer', 'productManager', 'superAdmin'], default: 'customer' }, // Role of the user
    profile: { // User's profile information
        firstName: String, // First name of the user
        lastName: String, // Last name of the user
        phone: String // Phone number of the user
    },
    addresses: [{ // Array of addresses associated with the user
        street: String, // Street address
        city: String, // City
        province: String, // Province or state
        postalCode: String, // Postal or ZIP code
        country: String, // Country
        isDefault: Boolean // Indicates if this is the default address
    }]
}, { timestamps: true });

// Method to compare a candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // Return true if passwords match
};

// Export the User model for use in other parts of the application
module.exports = mongoose.model('User', userSchema);