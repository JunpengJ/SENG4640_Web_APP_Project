// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Define the schema for flash sales
const flashSaleSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true }, // Reference to the Product model
    salePrice: { type: Number, required: true }, // Discounted price during the flash sale
    initialStock: { type: Number, required: true }, // Initial stock available for the flash sale
    sold: { type: Number, default: 0 }, // Number of items sold during the flash sale
    startTime: { type: Date, required: true }, // Start time of the flash sale
    endTime: { type: Date, required: true }, // End time of the flash sale
    status: { type: String, enum: ['upcoming', 'active', 'ended'], default: 'upcoming' } // Status of the flash sale
}, { timestamps: true });

// Virtual property to calculate the remaining stock
flashSaleSchema.virtual('remainingStock').get(function() {
    return this.initialStock - this.sold;
});

// Method to check if the flash sale is currently active
flashSaleSchema.methods.isActive = function() {
    const now = new Date();
    return this.status === 'active' && now >= this.startTime && now <= this.endTime && this.remainingStock > 0;
};

// Static method to update the statuses of flash sales based on the current time
flashSaleSchema.statics.updateStatuses = async function() {
    const now = new Date();
    await this.updateMany(
        { startTime: { $lte: now }, endTime: { $gte: now }, status: 'upcoming' },
        { status: 'active' }
    );
    await this.updateMany(
        { endTime: { $lt: now }, status: { $ne: 'ended' } },
        { status: 'ended' }
    );
};

// Export the FlashSale model for use in other parts of the application
module.exports = mongoose.model('FlashSale', flashSaleSchema);