const mongoose = require('mongoose');

// Define the schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
    name: { type: String, required: true }, // Name of the product
    price: { type: Number, required: true }, // Price of the product
    quantity: { type: Number, required: true, min: 1, default: 1 }, // Quantity of the product in the cart
    addedAt: { type: Date, default: Date.now } // Timestamp when the item was added to the cart
});

// Define the schema for the cart
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Reference to the User model, unique for each user
    items: [cartItemSchema] // Array of items in the cart
}, { timestamps: true });  // Automatically manage createdAt and updatedAt timestamps

// Export the Cart model
module.exports = mongoose.model('Cart', cartSchema);