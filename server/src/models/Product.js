// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Define the schema for products
const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the product
    description: String, // Description of the product
    price: { type: Number, required: true }, // Price of the product
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Categories the product belongs to
    images: [String], // Array of image URLs for the product
    inventory: { // Inventory details
        total: { type: Number, default: 0 }, // Total stock of the product
        reserved: { type: Number, default: 0 }, // Reserved stock for pending orders
        available: { type: Number, default: 0 } // Available stock for purchase
    },
    isActive: { type: Boolean, default: true } // Indicates if the product is active and available for purchase
}, { timestamps: true });

// Static method to decrease the inventory of a product
productSchema.statics.decreaseInventory = async function(productId, quantity) {
    const result = await this.updateOne(
        { _id: productId, 'inventory.available': { $gte: quantity } }, // Ensure sufficient available stock
        { $inc: { 'inventory.available': -quantity, 'inventory.reserved': quantity } } // Update inventory counts
    );
    return result.modifiedCount === 1; // Return true if the update was successful
};

// Export the Product model for use in other parts of the application
module.exports = mongoose.model('Product', productSchema);