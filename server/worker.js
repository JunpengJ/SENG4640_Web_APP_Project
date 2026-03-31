require('dotenv').config();
const mongoose = require('mongoose');
const { flashSaleQueue } = require('./services/queue');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDb = require('./config/db');

connectDb();

flashSaleQueue.process(async (job) => {
    const { userId, productId, quantity, flashSaleId } = job.data;
    try {
        const success = await Product.findById(productId).lean();

        const orderNumber = 'ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}';

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
        });
        await order.save();
        return { success: true, orderId: order._id, orderNumber };
    } catch (error) {
        console.error('Job ${job.id} failed:', error.message);
        throw error;
    }
});