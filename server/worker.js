// Import the DNS module to configure DNS settings
const dns = require('dns');
// Set custom DNS servers and prioritize IPv4 addresses
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

// Load environment variables from the .env file
require('dotenv').config();
// Import the Mongoose library for MongoDB interaction
const mongoose = require('mongoose');
// Import the flash sale queue
const { flashSaleQueue } = require('./src/services/queue');
// Import the Product and Order models
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
// Import the database connection function
const connectDb = require('./src/config/db');

// Connect to the MongoDB database
connectDb();

// Process jobs in the flash sale queue
flashSaleQueue.process(async (job) => {
    const { userId, productId, quantity, flashSaleId } = job.data; // Extract job data
    try {
        let salePrice = null;
        let flashSale = null;
        if (flashSaleId) {
            flashSale = await FlashSale.findById(flashSaleId); // Find the flash sale by ID
            if (!flashSale) throw new Error('Flash sale not found'); // Throw an error if the flash sale does not exist
            if (!flashSale.isActive()) throw new Error('Flash sale is not active'); // Throw an error if the flash sale is not active
            if (flashSale.remainingStock < quantity) throw new Error('Flash sale stock insufficient'); // Throw an error if there is insufficient stock
            salePrice = flashSale.salePrice; // Set the sale price
        }

        const product = await Product.findById(productId).lean(); // Find the product by ID
        if (!product) throw new Error('Product not found'); // Throw an error if the product does not exist

        const unitPrice = salePrice !== null ? salePrice : product.price; // Determine the unit price

        const updated = await Product.decreaseInventory(productId, quantity); // Decrease the product inventory
        if (!updated) throw new Error('Insufficient stock'); // Throw an error if inventory update fails

        if (flashSaleId) {
            const flashUpdated = await FlashSale.updateOne(
                { _id: flashSaleId, sold: { $lte: flashSale.initialStock - quantity } },
                { $inc: { sold: quantity } } // Update the sold count for the flash sale
            );
            if (flashUpdated.modifiedCount === 0) {
                throw new Error('Flash sale stock update failed'); // Throw an error if the flash sale update fails
            }
        }

        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`; // Generate a unique order number

        const order = new Order({
            orderNumber,
            userId,
            items:[{
                productId,
                name: product.name,
                price: flashSaleId ? product.flashSalePrice : product.price,
                quantity,
                subtotal: (flashSaleId ? product.flashSalePrice : product.price) * quantity
            }],
            totalAmount: (flashSaleId ? product.flashSalePrice : product.price) * quantity,
            flashSaleApplied: !!flashSaleId,
            payment: { status: 'pending' }
        }); // Create a new order
        await order.save(); // Save the order to the database
        return { success: true, orderId: order._id, orderNumber }; // Return the order details
    } catch (error) {
        console.error('Job ${job.id} failed:', error.message); // Log the error
        throw error; // Re-throw the error to mark the job as failed
    }
});