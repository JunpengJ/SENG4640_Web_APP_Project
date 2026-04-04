// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Define the schema for individual items in the cart
const cartItemSchema  = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
    name: { type: String, required: true }, // Name of the product
    price: { type: Number, required: true }, // Price of the product
    quantity: { type: Number, required: true, min: 1, default: 1 }, // Quantity of the product in the cart
    addedAt: { type: Date, default: Date.now } // Timestamp when the item was added to the cart
});

// Define the schema for the cart
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Reference to the User model
    items: [cartItemSchema], // Array of items in the cart
    updatedAt: { type: Date, default: Date.now } // Timestamp for the last update to the cart
});

// Middleware to update the updatedAt field before saving the cart
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the Cart model for use in other parts of the application
module.exports = mongoose.model('Cart', cartSchema);