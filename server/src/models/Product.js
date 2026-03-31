const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    categories: [String],
    images: [String],
    inventory: {
        total: { type: Number, default: 0 },
        reserved: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.statics.decreaseInventory = async function(productId, quantity) {
    const result = await this.updateOne(
        { _id:productId, 'inventory.abailable': { $gte: quantity } },
        { $inc: { 'inventory.available': -quantity, 'inventory.reserved': quantity } }
    );
    return result.modifiedCount === 1;
};

module.exports = mongoose.model('Product', productSchema);