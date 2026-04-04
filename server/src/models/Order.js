// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true }, // Unique identifier for the order
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to the Product model
        name: String, // Name of the product
        price: Number, // Price of the product
        quantity: Number, // Quantity of the product ordered
        subtotal: Number // Subtotal for the product (price * quantity)
    }],
    totalAmount: Number, // Total amount for the order
    shippingAddress: { // Shipping address details
        street: String,
        city: String,
        province: String,
        postalCode: String,
        country: String
    },
    payment: { // Payment details
        method: String, // Payment method (e.g., credit card, PayPal)
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Payment status
        transactionId: String // Transaction ID for the payment
    },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' }, // Order status
    flashSaleApplied: { type: Boolean, default: false } // Indicates if a flash sale was applied
}, { timestamps: true });

// Export the Order model for use in other parts of the application
module.exports = mongoose.model('Order', orderSchema);