const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number
    }],
    totalAmount: Number,
    shippingAddress: {
        street: String,
        city: String,
        city: String,
        province: String,
        postalCode: String,
        country: String
    },
    payment: {
        method: String,
        status:{ type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        transactionId: String
    },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing'},
    flashSaleApplied: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);